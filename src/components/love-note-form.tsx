
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heart, Send, Loader2, Wand2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateLoveMessage, type GenerateLoveMessageInput } from "@/ai/flows/generate-love-message";
import { ScrollArea } from './ui/scroll-area';

const moodOptions = [
  "Happy", "Sad", "Reflective", "Excited", "Joyful", "Content", "Grateful", "Hopeful", "Peaceful", "Playful", "Proud", "Confident", "Curious", "Inspired", "Optimistic", "Amused", "Loving", "Energetic", 
  "Thoughtful", "Pensive", 
  "Surprised", "Furious", "Euphoric", "Desperate", "Ecstatic", 
].sort();


const FormSchema = z.object({
  mood: z.string({
    required_error: "Please select a mood to inspire Samson's note.",
  }).min(1, "Please select a mood."),
});

export function LoveNoteForm() {
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageKey, setMessageKey] = useState(0); 
  const [showInitialHeart, setShowInitialHeart] = useState(true);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mood: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setGeneratedMessage(null);
    setShowInitialHeart(false);
    
    try {
      const result = await generateLoveMessage({ mood: data.mood });
      setGeneratedMessage(result.message);
      setMessageKey(prev => prev + 1); 
    } catch (error) {
      console.error("Failed to generate love message:", error);
      toast({
        variant: "destructive",
        title: "Oh dear! A little hiccup.",
        description: "There was a problem channeling Samson's feelings. Please try again.",
      });
      setShowInitialHeart(true); // Show heart again if error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-2xl rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm border-primary/30">
      <CardHeader className="text-center p-6 border-b border-primary/20">
        <div className="flex items-center justify-center mb-2">
          <Heart className="w-10 h-10 text-primary animate-pulse-love" />
        </div>
        <CardTitle className="font-headline text-4xl text-primary-foreground">Messages from Samson</CardTitle>
        <CardDescription className="font-body text-primary-foreground/80 text-base pt-1">
          Lillian, select a mood to receive a heartfelt love note from Samson, written just for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-lg text-primary-foreground/90">Choose a Mood for Samson's Note</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger 
                        aria-label="Select mood for Samson's note" 
                        className="font-body text-base border-input-border focus:border-accent focus:ring-accent">
                        <SelectValue placeholder="Select a mood to inspire Samson..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="font-body bg-popover border-primary/50">
                      <ScrollArea className="h-[200px]">
                      {moodOptions.map((mood) => (
                        <SelectItem key={mood} value={mood} className="hover:bg-accent/50 focus:bg-accent/70">
                          {mood}
                        </SelectItem>
                      ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full font-headline text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Channeling Samson's words...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Note from Samson
                </>
              )}
            </Button>
          </form>
        </Form>

        {showInitialHeart && !generatedMessage && !isLoading && (
          <div className="text-center mt-12 py-8">
            <Heart className="w-16 h-16 text-primary/50 mx-auto animate-pulse-heart" />
            <p className="mt-4 font-body text-primary-foreground/70">Waiting for your inspiration, Lillian...</p>
          </div>
        )}
        
        {generatedMessage && (
          <div key={messageKey} className="mt-10 p-6 border border-primary/40 rounded-xl bg-background/60 shadow-lg animate-in fade-in-0 zoom-in-95 duration-700">
            <h3 className="font-headline text-2xl text-primary mb-4 text-center">A Note from Samson to You, Lillian:</h3>
            <ScrollArea className="h-auto max-h-[300px] p-1">
              <p className="text-primary-foreground/90 whitespace-pre-wrap font-body text-lg leading-relaxed text-justify">
                {generatedMessage}
              </p>
            </ScrollArea>
            <div className="flex justify-center mt-6 pt-4 border-t border-primary/20">
              <Heart className="w-8 h-8 text-primary animate-pulse-heart" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-primary/10 border-t border-primary/20 text-center">
        <p className="font-body text-sm text-primary-foreground/70 mx-auto">
          A special message from Samson to Lillian, inspired by your chosen mood.
        </p>
      </CardFooter>
    </Card>
  );
}
