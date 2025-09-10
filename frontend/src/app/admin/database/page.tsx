'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon, TrashIcon, PencilIcon, PlusIcon, DatabaseIcon, TableCellsIcon, ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TableData {
  name: string;
  rows: any[];
  columns: string[];
  isExpanded: boolean;
}

export default function DatabaseManager() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<{ table: string; id: any } | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTables, setFilteredTables] = useState<TableData[]>([]);
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all tables and their data
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/database/tables');
      const data = await response.json();
      setTables(data.tables.map((t: any) => ({ ...t, isExpanded: false })));
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Filter tables based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = tables.map(table => {
        if (table.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return table;
        }
        
        // Filter rows if table is expanded
        if (table.isExpanded && table.rows.length > 0) {
          const filteredRows = table.rows.filter(row => {
            return Object.values(row).some(value => 
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
          
          if (filteredRows.length > 0) {
            return { ...table, rows: filteredRows };
          }
        }
        
        return null;
      }).filter(Boolean) as TableData[];
      
      setFilteredTables(filtered);
    } else {
      setFilteredTables(tables);
    }
  }, [searchTerm, tables]);

  const toggleTable = async (tableName: string) => {
    const tableIndex = tables.findIndex(t => t.name === tableName);
    const table = tables[tableIndex];
    
    if (!table.isExpanded && table.rows.length === 0) {
      // Fetch table data
      try {
        const response = await fetch(`/api/v1/admin/database/tables/${tableName}`);
        const data = await response.json();
        
        const updatedTables = [...tables];
        updatedTables[tableIndex] = {
          ...table,
          rows: data.rows,
          columns: data.columns,
          isExpanded: true
        };
        setTables(updatedTables);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    } else {
      // Toggle expansion
      const updatedTables = [...tables];
      updatedTables[tableIndex].isExpanded = !table.isExpanded;
      setTables(updatedTables);
    }
  };

  const handleEdit = (tableName: string, row: any) => {
    setEditingRow({ table: tableName, id: row.id });
    setEditValues(row);
  };

  const handleSave = async () => {
    if (!editingRow) return;

    try {
      const response = await fetch(`/api/v1/admin/database/tables/${editingRow.table}/${editingRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues)
      });

      if (response.ok) {
        await refreshTable(editingRow.table);
        setEditingRow(null);
        setEditValues({});
      }
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleDelete = async (tableName: string, id: any) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/v1/admin/database/tables/${tableName}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await refreshTable(tableName);
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const handleAdd = async () => {
    if (!selectedTable) return;

    try {
      const response = await fetch(`/api/v1/admin/database/tables/${selectedTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRowData)
      });

      if (response.ok) {
        await refreshTable(selectedTable);
        setShowAddModal(false);
        setNewRowData({});
      }
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const refreshTable = async (tableName: string) => {
    try {
      const response = await fetch(`/api/v1/admin/database/tables/${tableName}`);
      const data = await response.json();
      
      const updatedTables = [...tables];
      const tableIndex = tables.findIndex(t => t.name === tableName);
      updatedTables[tableIndex] = {
        ...updatedTables[tableIndex],
        rows: data.rows,
        columns: data.columns
      };
      setTables(updatedTables);
    } catch (error) {
      console.error('Error refreshing table:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <DatabaseIcon className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Database Manager</h1>
            </div>
            <button
              onClick={fetchTableData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search Bar and Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tables or data..."
                className="block w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
              )}
              </div>
              
              {/* Rows per page selector */}
              <div className="flex items-center space-x-2">
                <label className="text-gray-400 text-sm">Show:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-gray-400 text-sm">entries</span>
              </div>
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-400">
                Found {filteredTables.length} matching table{filteredTables.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Adminer Link */}
          <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
            <p className="text-blue-300 mb-2">Advanced Database Management:</p>
            <a
              href="http://localhost:8090"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <DatabaseIcon className="h-5 w-5" />
              <span>Open Adminer</span>
            </a>
            <p className="text-gray-400 text-sm mt-2">
              Server: <code className="bg-gray-800 px-2 py-1 rounded">mysql</code> | 
              Username: <code className="bg-gray-800 px-2 py-1 rounded">root</code> | 
              Password: <code className="bg-gray-800 px-2 py-1 rounded">rootpassword</code> | 
              Database: <code className="bg-gray-800 px-2 py-1 rounded">hatamo</code>
            </p>
          </div>

          {/* Tables */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {(searchTerm ? filteredTables : tables).map((table) => (
                <div key={table.name} className="bg-gray-700/50 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div
                    onClick={() => toggleTable(table.name)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {table.isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <TableCellsIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">{table.name}</span>
                      <span className="text-gray-400 text-sm">({table.rows.length} rows)</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTable(table.name);
                        setShowAddModal(true);
                      }}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Table Content */}
                  {table.isExpanded && table.rows.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50">
                          <tr>
                            {table.columns.map((column) => (
                              <th key={column} className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {column}
                              </th>
                            ))}
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                          {(() => {
                            const page = currentPage[table.name] || 1;
                            const start = (page - 1) * rowsPerPage;
                            const end = start + rowsPerPage;
                            const paginatedRows = table.rows.slice(start, end);
                            return paginatedRows.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                              {table.columns.map((column) => (
                                <td key={column} className="px-4 py-2 text-sm text-gray-300">
                                  {editingRow?.table === table.name && editingRow?.id === row.id ? (
                                    <input
                                      type="text"
                                      value={editValues[column] || ''}
                                      onChange={(e) => setEditValues({ ...editValues, [column]: e.target.value })}
                                      className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    />
                                  ) : (
                                    <span>{row[column] || '-'}</span>
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-2 text-sm">
                                {editingRow?.table === table.name && editingRow?.id === row.id ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={handleSave}
                                      className="text-green-400 hover:text-green-300"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingRow(null);
                                        setEditValues({});
                                      }}
                                      className="text-gray-400 hover:text-gray-300"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(table.name, row)}
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(table.name, row.id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                            )); })()}
                        </tbody>
                      </table>
                      
                      {/* Pagination */}
                      {table.rows.length > rowsPerPage && (
                        <div className="px-4 py-3 bg-gray-800/30 flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            Showing {((currentPage[table.name] || 1) - 1) * rowsPerPage + 1} to{' '}
                            {Math.min((currentPage[table.name] || 1) * rowsPerPage, table.rows.length)} of{' '}
                            {table.rows.length} entries
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCurrentPage({ ...currentPage, [table.name]: Math.max(1, (currentPage[table.name] || 1) - 1) })}
                              disabled={(currentPage[table.name] || 1) === 1}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
                            >
                              Previous
                            </button>
                            <span className="px-3 py-1 text-white">
                              Page {currentPage[table.name] || 1} of {Math.ceil(table.rows.length / rowsPerPage)}
                            </span>
                            <button
                              onClick={() => setCurrentPage({ ...currentPage, [table.name]: Math.min(Math.ceil(table.rows.length / rowsPerPage), (currentPage[table.name] || 1) + 1) })}
                              disabled={(currentPage[table.name] || 1) === Math.ceil(table.rows.length / rowsPerPage)}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Add New Row to {selectedTable}</h2>
            <div className="space-y-4">
              {tables.find(t => t.name === selectedTable)?.columns.map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">{column}</label>
                  <input
                    type="text"
                    value={newRowData[column] || ''}
                    onChange={(e) => setNewRowData({ ...newRowData, [column]: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewRowData({});
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}