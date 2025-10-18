'use client';

import { useState } from 'react';
import { ClientLayout } from '@/components/client/ClientLayout';

// メッセージデータ
const CONVERSATIONS = [
  {
    id: '1',
    sponsorName: '田中太郎',
    service: 'Webサイト制作',
    lastMessage: 'Webサイト制作について相談したいです',
    timestamp: '365日前',
    unreadCount: 1,
    isActive: true,
  },
  {
    id: '2',
    sponsorName: '佐藤花子',
    service: 'SEOコンサル',
    lastMessage: 'ありがとうございました！',
    timestamp: '365日前',
    unreadCount: 0,
    isActive: false,
  },
  {
    id: '3',
    sponsorName: '山田一郎',
    service: 'ロゴデザイン',
    lastMessage: '了解しました。よろしくお願いします。',
    timestamp: '366日前',
    unreadCount: 0,
    isActive: false,
  },
  {
    id: '4',
    sponsorName: '鈴木次郎',
    service: 'LP制作',
    lastMessage: '見積もりについて教えてください',
    timestamp: '367日前',
    unreadCount: 0,
    isActive: false,
  },
];

// チャットメッセージデータ
const CHAT_MESSAGES = [
  {
    id: '1',
    sender: 'client',
    senderName: 'あなた',
    message: 'こんにちは！Webサイト制作についてご相談させてください。',
    timestamp: '14:30',
  },
  {
    id: '2',
    sender: 'sponsor',
    senderName: '田中太郎',
    message: 'ご連絡ありがとうございます。どのようなWebサイトをお考えでしょうか？',
    timestamp: '14:35',
  },
  {
    id: '3',
    sender: 'client',
    senderName: 'あなた',
    message: 'はい、ECサイトを構築したいと考えています。予算は50万円程度です。',
    timestamp: '14:40',
  },
  {
    id: '4',
    sender: 'sponsor',
    senderName: '田中太郎',
    message: 'わかりました。詳細をお伺いして、お見積もりをご提示させていただきます。',
    timestamp: '14:45',
  },
  {
    id: '5',
    sender: 'client',
    senderName: 'あなた',
    message: 'それでは進めていただけますでしょうか？よろしくお願いします。',
    timestamp: '14:50',
  },
  {
    id: '6',
    sender: 'client',
    senderName: 'あなた',
    message: 'Webサイト制作について相談したいです',
    timestamp: '14:55',
  },
];

export default function ClientMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState('');

  return (
    <ClientLayout>
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#0f172b] mb-1">メッセージ</h1>
          <div className="h-1 w-20 bg-blue-500 rounded-full mt-3"></div>
        </div>

        {/* メッセージコンテナ */}
        <div className="flex gap-6">
          {/* 会話一覧 */}
          <div className="w-[362px] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[533px]">
            {/* ヘッダー */}
            <div className="px-4 py-4 border-b border-slate-200">
              <h3 className="text-lg font-medium text-[#0f172b]">会話</h3>
            </div>

            {/* 会話リスト */}
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full px-4 py-4 border-b border-slate-100 text-left transition-colors ${
                    conversation.isActive ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* アバター */}
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0"></div>

                    {/* コンテンツ */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-base font-medium text-[#0f172b] truncate">
                          {conversation.sponsorName}
                        </h4>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded min-w-[23px] h-[22px] flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[#45556c] truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#62748e]">
                        <span>{conversation.service}</span>
                        <span>{conversation.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* チャットエリア */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[533px]">
            {/* チャットヘッダー */}
            <div className="px-4 py-4 border-b border-slate-200 flex items-center gap-3">
              {/* アバター */}
              <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>

              {/* ユーザー情報 */}
              <div>
                <h3 className="text-base text-[#0f172b]">
                  {selectedConversation.sponsorName}とのチャット
                </h3>
                <p className="text-sm text-[#45556c]">{selectedConversation.service}</p>
              </div>
            </div>

            {/* メッセージエリア */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {CHAT_MESSAGES.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                >
                  {/* メッセージバブル */}
                  <div
                    className={`max-w-[500px] px-4 pt-2 pb-2 rounded-lg ${
                      msg.sender === 'client'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-[#0f172b]'
                    }`}
                  >
                    <p className="text-sm mb-1">{msg.senderName}:</p>
                    <p className="text-base leading-6">{msg.message}</p>
                  </div>

                  {/* タイムスタンプ */}
                  <span
                    className={`text-xs text-[#62748e] mt-1 ${
                      msg.sender === 'client' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* 入力エリア */}
            <div className="border-t border-slate-200 px-4 py-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 h-9 px-3 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="w-10 h-9 bg-blue-500 rounded-md flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity disabled:opacity-30"
                  disabled={!messageInput.trim()}
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 16 16">
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 2L7 9M14 2L9 14L7 9M14 2L2 7L7 9"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
