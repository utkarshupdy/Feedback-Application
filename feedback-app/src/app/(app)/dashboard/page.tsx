'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message, User } from '@/model/User';

import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const {watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages', { withCredentials: true });
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message setting',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages', { withCredentials: true });
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: response.data.message,
            variant: 'default',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message || 'Failed to fetch message setting',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: 'Updated Accept Messages',
        description: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to update message setting',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const copyToClipboard = () => {
    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL copied to clipboard',
      description: 'Profile URL has been copied to clipboard',
      variant: 'default',
    });
  };

  if (!session || !session.user) {
    return (
      <div
        className="flex flex-col h-screen bg-cover bg-center bg-no-repeat text-white"
        style={{
          // backgroundImage: `url('https://img.freepik.com/free-photo/feedback-results-information-satisfeaction_53876-121336.jpg')`,
          backgroundImage: `url('/feedback_image.jpg')`,
        }}
      >
        <div className="flex flex-col justify-center items-center h-full bg-black bg-opacity-60">
          <h1 className="text-4xl font-bold mb-6 text-center">Unauthorized Access</h1>
          <p className="mb-4 text-xl text-gray-300 text-center">
            You must be logged in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 flex flex-col"
      style={{
        backgroundImage: `url('/feedback_image.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto flex-grow"
      style={{
        backdropFilter: 'blur(5px)', // Adds the blur effect
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
      }}
      
      >
        
        <h1 className="text-4xl font-bold text-white mb-4">User Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Copy Your Unique Link</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={`${window.location.protocol}//${window.location.host}/u/${(session.user as User).username}`}
              disabled
              className="input input-bordered w-full p-2 rounded-md"
            />
            <Button onClick={copyToClipboard} className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center text-white">
          <Switch
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="mr-2"
          />
          <span className="text-sm">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>

        <Separator className="my-4 border-gray-300" />

        <Button
          className="mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>

        <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-lg shadow-lg backdrop-blur-sm bg-opacity-20 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  className="transition-all duration-300 hover:scale-105 hover:shadow-xl"
                />
              ))
            ) : (
              <p className="text-white opacity-20 text-center">No messages to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
