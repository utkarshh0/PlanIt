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


const formSchema = z.object({
    username: z.string().min(2, {message: "Please Enter a username"}),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

const onSubmit = (data) => {
  console.log("Form submitted with data:", data)
}

const SignUp: React.FC<{handleClick: () => void}> = ({handleClick}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <p className="text-3xl font-bold tracking-wider text-center mb-2">Sign Up</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 tracking-wide">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
        
        <Button type="submit" className="w-full font-bold">Sign Up</Button>
        <p className="text-right text-sm text-gray-500">
          Already have an account?{" "}
          <button 
            type="button" 
            className="text-white hover:underline"
            onClick={handleClick}
          >
            Sign In
          </button>
        </p>
      </form>
    </Form>
  )
}

export default SignUp
