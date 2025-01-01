import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }),
})

type FormData = z.infer<typeof formSchema>

const SignIn: React.FC<{handleClick: () => void}> = ({handleClick}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "utk@gmail.com",
      password: "utkk",
    },
  })
  const[loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const response = await fetch("https://planit-amv2.onrender.com/api/user/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const resp = await response.json()
        setErrorMessage(resp.error || "Server error, please try again.")
        return
      }

      const result = await response.json()
      localStorage.setItem('token', `Bearer ${result.token}`)
      navigate('/events')
      
    } catch (error) {
      console.error('Error during login:', error)
      setErrorMessage("An unexpected error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className="absolute top-5 right-5 text-xs opacity-75">
        <p>Demo User</p>
        <p>Email : utk@gmail.com</p>
        <p>Password : utkk</p>
      </div>
      <p className="text-3xl font-bold tracking-wider text-center mb-2">Sign In</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 tracking-wide">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        
        {loading ? 
            <Button className="w-full font-bold" disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button> 
                :
            <Button type="submit" className="w-full font-bold">Sign In</Button>
        }
        <p className="text-right text-sm text-gray-500">
          Don’t have an account?{" "}
          <button 
            type="button" 
            className="text-white hover:underline"
            onClick={handleClick}
          >
            Sign Up
          </button>
        </p>
      </form>
    </Form>
  )
}

export default SignIn
