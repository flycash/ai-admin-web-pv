"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data matching backend PromptVersionVO structure
const mockPrompts = [
  {
    id: 1,
    label: "Text Summarization",
    content: "Summarize the following text in bullet points:\n\n{{text}}",
    system_content: "You are a helpful assistant that specializes in text summarization.",
    temperature: 0.7,
    top_n: 0.9,
    max_tokens: 500,
    status: 1,
  },
  {
    id: 2,
    label: "Code Generation",
    content: "Write {{language}} code to solve the following problem:\n\n{{problem}}",
    system_content: "You are an expert programmer who writes clean, efficient code.",
    temperature: 0.2,
    top_n: 1.0,
    max_tokens: 1000,
    status: 1,
  },
  {
    id: 3,
    label: "Creative Writing",
    content: "Write a {{genre}} story about {{topic}}",
    system_content: "You are a creative writer with excellent storytelling abilities.",
    temperature: 0.9,
    top_n: 0.95,
    max_tokens: 2000,
    status: 0,
  },
]

const formSchema = z.object({
  label: z.string().min(2, {
    message: "Label must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  system_content: z.string().min(5, {
    message: "System content must be at least 5 characters.",
  }),
  temperature: z.number().min(0).max(1),
  top_n: z.number().min(0).max(1),
  max_tokens: z.number().min(1).max(4000),
  status: z.number().min(0).max(1),
})

interface PromptFormProps {
  id?: string
}

export function PromptForm({ id }: PromptFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      content: "",
      system_content: "",
      temperature: 0.7,
      top_n: 0.9,
      max_tokens: 500,
      status: 1,
    },
  })

  useEffect(() => {
    if (id) {
      // In a real app, fetch the prompt data from API: GET /prompt/:id
      const prompt = mockPrompts.find((p) => p.id.toString() === id)
      if (prompt) {
        form.reset(prompt)
      }
    }
  }, [id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      if (id) {
        // Update existing prompt: POST /prompt/update/version
        const response = await fetch("/api/prompt/update/version", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number.parseInt(id),
            ...values,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to update prompt")
        }
      } else {
        // Create new prompt: POST /prompt/add
        const response = await fetch("/api/prompt/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error("Failed to create prompt")
        }
      }

      router.push("/dashboard/prompts")
    } catch (error) {
      console.error("Error saving prompt:", error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Text Summarization" {...field} />
                    </FormControl>
                    <FormDescription>A descriptive label for your prompt.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Set the status of this prompt.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Controls randomness: Lower values are more deterministic, higher values are more creative.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="top_n"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top N: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are
                      considered.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_tokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={4000}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>The maximum number of tokens to generate in the completion.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="system_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a helpful assistant..."
                      className="min-h-[100px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The system prompt that defines the AI's behavior and role.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Prompt Template</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your prompt template here. Use {{variable}} for placeholders."
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write your prompt template. Use double curly braces for variables, e.g., {"{{variable}}"}.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/prompts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : id ? "Update Prompt" : "Create Prompt"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
