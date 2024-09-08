'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Wand2, Copy, Volume2 } from "lucide-react"
import Link from 'next/link'

export default function StoryGenerator() {
  const [genre, setGenre] = useState('')
  const [setting, setSetting] = useState('')
  const [characters, setCharacters] = useState('')
  const [plotPoints, setPlotPoints] = useState('')
  const [generatedStory, setGeneratedStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null); 

  const createPrompt = () => {
    let prompt = "Create a story";
  
    if (genre) {
      prompt += ` in the ${genre} genre`;
    }
  
    if (setting) {
      prompt += ` set in ${setting}`;
    }
  
    if (characters) {
      prompt += ` with characters like ${characters}`;
    }
  
    if (plotPoints) {
      prompt += `. The plot involves ${plotPoints}`;
    }
  
    prompt += ".";
  
    return prompt;
  };
  
  const handleGenerate = async () => {
    setIsLoading(true);
  
    try {
      const prompt = createPrompt();
  
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }), 
      });
  
      const data = await response.json();
      setGeneratedStory(data.response);
    } catch (error) {
      console.error("Error generating story:", error);
      setGeneratedStory("An error occurred while generating the story.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedStory).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const handleReadAloud = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsReading(false);
      return; 
    }
  
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Browser does not support speech synthesis");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(generatedStory);
    utterance.onend = () => {
      setIsReading(false);
      speechSynthesisRef.current = null;
    };
  
    speechSynthesisRef.current = synth;
    speechSynthesisRef.current.speak(utterance);
    setIsReading(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"></div>
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      <header className="relative py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-800">
            <BookOpen className="h-6 w-6" />
            StoryForge AI
          </h1>
        </div>
      </header>

      <main className="relative flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm text-slate-900 border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-slate-800 flex items-center gap-2">
              <Wand2 className="h-6 w-6" />
              Craft Your Tale
            </CardTitle>
            <CardDescription className="text-slate-600">
              Shape your story&apos;s elements and let our AI weave a unique narrative for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-slate-700">Genre</Label>
                  <Select onValueChange={setGenre}>
                    <SelectTrigger id="genre" className="bg-white border-slate-300 text-slate-900">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-slate-900">
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="sci-fi">Science Fiction</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setting" className="text-slate-700">Setting</Label>
                  <Input
                    id="setting"
                    placeholder="e.g., Medieval castle, Space station"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    className="bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="characters" className="text-slate-700">Main Characters</Label>
                <Input
                  id="characters"
                  placeholder="e.g., A brave knight, A cunning wizard"
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plotPoints" className="text-slate-700">Key Plot Points</Label>
                <Textarea
                  id="plotPoints"
                  placeholder="e.g., A magical artifact is stolen, An ancient prophecy is revealed"
                  value={plotPoints}
                  onChange={(e) => setPlotPoints(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerate} className="w-full bg-slate-800 hover:bg-slate-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H">
                    </path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Story
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
        {generatedStory && (
          <Card className="mt-8 w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm text-slate-900 border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-800 flex justify-between items-center">
                <span>Your Generated Story</span>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                  <Button
                    onClick={handleReadAloud}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    title={isReading ? "Stop reading" : "Read aloud"}
                  >
                    <Volume2 className="h-4 w-4" />
                    <span className="sr-only">Read aloud</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{generatedStory}</p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="relative text-slate-600 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 ">
        <p className="text-sm ">© 2024 StoryForge AI. Abhiram Reddy Nanabolu.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm hover:text-slate-900 hover:underline transition-colors" target="_blank" href="https://github.com/Abhiramnanabolu">
            Github
          </Link>
          <Link className="text-sm hover:text-slate-900 hover:underline transition-colors" target="_blank" href="https://abhiramreddy.online/">
            Portfolio
          </Link>
        </nav>
      </footer>
    </div>
  )
} 