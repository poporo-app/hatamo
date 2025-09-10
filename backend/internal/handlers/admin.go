package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AdminHandler struct {
	db *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{
		db: db,
	}
}

// GetTables returns all table names in the database
func (h *AdminHandler) GetTables(c *gin.Context) {
	var tables []string
	
	// Get all table names from information_schema
	query := `
		SELECT table_name 
		FROM information_schema.tables 
		WHERE table_schema = ? 
		AND table_name NOT IN ('schema_migrations')
		ORDER BY table_name
	`
	
	rows, err := h.db.Raw(query, "hatamo").Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch tables",
		})
		return
	}
	defer rows.Close()
	
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			continue
		}
		tables = append(tables, tableName)
	}
	
	// Get row count for each table
	type TableInfo struct {
		Name string `json:"name"`
		Rows []map[string]interface{} `json:"rows"`
		Columns []string `json:"columns"`
	}
	
	var tableInfos []TableInfo
	for _, table := range tables {
		// Get row count
		var count int64
		h.db.Table(table).Count(&count)
		
		tableInfos = append(tableInfos, TableInfo{
			Name: table,
			Rows: []map[string]interface{}{}, // Empty initially
			Columns: []string{},
		})
	}
	
	c.JSON(http.StatusOK, gin.H{
		"tables": tableInfos,
	})
}

// GetTableData returns all data from a specific table
func (h *AdminHandler) GetTableData(c *gin.Context) {
	tableName := c.Param("table")
	
	// Validate table name to prevent SQL injection
	if !isValidTableName(tableName) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid table name",
		})
		return
	}
	
	// Get columns
	columnsQuery := `
		SELECT column_name 
		FROM information_schema.columns 
		WHERE table_schema = ? AND table_name = ?
		ORDER BY ordinal_position
	`
	
	var columns []string
	rows, err := h.db.Raw(columnsQuery, "hatamo", tableName).Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch columns",
		})
		return
	}
	defer rows.Close()
	
	for rows.Next() {
		var columnName string
		if err := rows.Scan(&columnName); err != nil {
			continue
		}
		columns = append(columns, columnName)
	}
	
	// Get data
	var results []map[string]interface{}
	if err := h.db.Table(tableName).Find(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch data",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"table": tableName,
		"columns": columns,
		"rows": results,
	})
}

// UpdateTableRow updates a specific row in a table
func (h *AdminHandler) UpdateTableRow(c *gin.Context) {
	tableName := c.Param("table")
	rowID := c.Param("id")
	
	// Validate table name
	if !isValidTableName(tableName) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid table name",
		})
		return
	}
	
	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
		})
		return
	}
	
	// Remove id from update data if present
	delete(updateData, "id")
	
	// Update the row
	if err := h.db.Table(tableName).Where("id = ?", rowID).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update row",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Row updated successfully",
	})
}

// DeleteTableRow deletes a specific row from a table
func (h *AdminHandler) DeleteTableRow(c *gin.Context) {
	tableName := c.Param("table")
	rowID := c.Param("id")
	
	// Validate table name
	if !isValidTableName(tableName) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid table name",
		})
		return
	}
	
	// Delete the row
	if err := h.db.Table(tableName).Where("id = ?", rowID).Delete(nil).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete row",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Row deleted successfully",
	})
}

// CreateTableRow creates a new row in a table
func (h *AdminHandler) CreateTableRow(c *gin.Context) {
	tableName := c.Param("table")
	
	// Validate table name
	if !isValidTableName(tableName) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid table name",
		})
		return
	}
	
	var newData map[string]interface{}
	if err := c.ShouldBindJSON(&newData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
		})
		return
	}
	
	// Remove id if present (let database auto-generate)
	delete(newData, "id")
	
	// Create the row
	if err := h.db.Table(tableName).Create(&newData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Failed to create row: %v", err),
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Row created successfully",
		"data": newData,
	})
}

// RegisterRoutes registers all admin routes
func (h *AdminHandler) RegisterRoutes(r *gin.RouterGroup) {
	admin := r.Group("/admin")
	{
		// Database management routes
		db := admin.Group("/database")
		{
			db.GET("/tables", h.GetTables)
			db.GET("/tables/:table", h.GetTableData)
			db.POST("/tables/:table", h.CreateTableRow)
			db.PUT("/tables/:table/:id", h.UpdateTableRow)
			db.DELETE("/tables/:table/:id", h.DeleteTableRow)
		}
	}
}

// Helper function to validate table names (prevent SQL injection)
func isValidTableName(name string) bool {
	// Only allow alphanumeric characters and underscores
	for _, ch := range name {
		if !((ch >= 'a' && ch <= 'z') || 
			 (ch >= 'A' && ch <= 'Z') || 
			 (ch >= '0' && ch <= '9') || 
			 ch == '_') {
			return false
		}
	}
	
	// Check against known table names
	validTables := []string{
		"users", "sponsors", "services", "service_packages",
		"applications", "messages", "reviews", "sponsor_documents",
		"payments", "settlements",
	}
	
	for _, valid := range validTables {
		if strings.EqualFold(name, valid) {
			return true
		}
	}
	
	return false
}