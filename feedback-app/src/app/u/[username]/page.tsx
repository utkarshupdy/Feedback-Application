'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/apiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// const initialMessageString =
//   "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post('/api/suggest-messages');
      const { completion } = response.data;

      if (completion && Array.isArray(completion)) {
        setSuggestedMessages(completion); // Store suggested messages in state
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch suggested messages',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: 'url(/feedback_image.jpg)', // Your background image URL
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 container mx-auto my-8 p-6 backdrop-blur-md rounded-lg shadow-lg max-w-4xl opacity-90">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">
          Public Profile Link
        </h1>
        <div className="space-y-8"> {/* Space between components */}
          {/* Profile URL Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Send Anonymous Message to @{username}</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here"
                          className="resize-none bg-gray-100 text-black focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !messageContent}
                      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                    >
                      Send It
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>

          {/* Suggested Messages Section */}
          <div className="space-y-4">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4 bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
              disabled={isSuggestLoading}
            >
              {isSuggestLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Suggest Messages'
              )}
            </Button>
            <p className="text-white">Click on any message below to select it.</p>
            <Card className="bg-black bg-opacity-10">
              <CardHeader>
                <h3 className="text-xl font-semibold text-black">Suggested Messages</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                {suggestedMessages.length > 0 ? (
                  suggestedMessages.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="mb-2 hover:bg-blue-100 transition-all duration-300 text-black"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                ) : (
                  <p className="text-gray-600 text-center text-white">
                    No suggested messages available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4 text-white">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
