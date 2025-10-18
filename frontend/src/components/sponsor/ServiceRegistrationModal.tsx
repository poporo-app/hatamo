'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// カテゴリ一覧
const CATEGORIES = [
  { value: 'it', label: 'IT開発' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'consulting', label: 'コンサル' },
  { value: 'lifestyle', label: 'くらし' },
  { value: 'investment', label: '投資' },
];

// フォームバリデーションスキーマ
const serviceFormSchema = z.object({
  title: z.string().min(1, 'サービス名を入力してください'),
  description: z.string().min(1, '説明を入力してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  price: z
    .string()
    .min(1, '価格を入力してください')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 10000, {
      message: '価格は10,000円以上で入力してください',
    }),
  commissionRate: z
    .string()
    .min(1, '手数料率を入力してください')
    .refine(
      (val) =>
        !isNaN(Number(val)) &&
        [20, 30, 40, 50].includes(Number(val)),
      {
        message: '手数料率は20, 30, 40, 50のいずれかを選択してください',
      }
    ),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormValues) => void;
}

export function ServiceRegistrationModal({
  open,
  onOpenChange,
  onSubmit,
}: ServiceRegistrationModalProps) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      commissionRate: '',
      imageUrl: '',
      tags: [],
      isPublished: false,
    },
  });

  const commissionRate = watch('commissionRate');
  const isPublished = watch('isPublished');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleFormSubmit = (data: ServiceFormValues) => {
    onSubmit({ ...data, tags });
    // フォームをリセット
    setTags([]);
    setTagInput('');
  };

  // 合計手数料率を計算
  const totalCommissionRate = commissionRate
    ? Number(commissionRate) + 5
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[512px] max-h-[90vh] overflow-y-auto bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            新規サービス作成
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            新しいサービスを作成します。すべての項目を入力してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
          {/* サービス名 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-900">
              サービス名 *
            </Label>
            <Input
              id="title"
              placeholder="例: Webサイト制作"
              {...register('title')}
              className="h-9 text-sm"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 説明 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-900">
              説明 *
            </Label>
            <Textarea
              id="description"
              placeholder="サービスの詳細説明を入力してください"
              {...register('description')}
              className="min-h-[64px] text-sm resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* カテゴリと価格 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-slate-900">
                カテゴリ *
              </Label>
              <Select
                onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
              >
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-slate-900">
                価格（円）*
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="50000"
                {...register('price')}
                className="h-9 text-sm"
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* 希望手数料率 */}
          <div className="space-y-2">
            <Label htmlFor="commissionRate" className="text-sm font-medium text-slate-900">
              希望手数料率（%）*
            </Label>
            <Input
              id="commissionRate"
              type="number"
              placeholder="30"
              {...register('commissionRate')}
              className="h-9 text-sm"
            />
            {errors.commissionRate && (
              <p className="text-xs text-red-500">{errors.commissionRate.message}</p>
            )}
            <p className="text-xs text-[#62748e]">
              ※ システム手数料5%が加算され、合計{totalCommissionRate}%となります
            </p>
          </div>

          {/* 画像URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium text-slate-900">
              画像URL（オプション）
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
              className="h-9 text-sm"
            />
          </div>

          {/* タグ */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-slate-900">
              タグ（オプション）
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="タグを入力してEnter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="h-9 text-sm flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                className="h-9 px-4 text-sm"
              >
                追加
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* すぐに公開する */}
          <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="isPublished" className="text-sm font-medium text-slate-900">
                すぐに公開する
              </Label>
              <p className="text-xs text-[#62748e]">
                オフの場合、下書きとして保存されます
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue('isPublished', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-sm"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="h-9 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
