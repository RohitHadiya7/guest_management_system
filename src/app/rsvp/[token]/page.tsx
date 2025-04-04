"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { rsvpGuest, getRsvpPage } from '@/lib/api' 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"


interface EventDetails {
  name: string
  date: string
  time: string
  location: string
}

export default function RSVPPage() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { token } = useParams()

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await getRsvpPage(token) 
        setEventDetails(response.event) 
      } catch (err: any) {
        console.error("Error fetching event details:", err)
        setError(err.message || 'Error fetching event details')
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [token])

  const handleRSVP = async (status: string) => {
    try {
      await rsvpGuest(token, status) 
      toast.success('RSVP updated successfully!')
      router.push('/') 
    } catch (err: any) {
      console.error("Error updating RSVP:", err)
      setError(err.message || 'Error updating RSVP')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!eventDetails) {
    return <p>Event details not found.</p>
  }

  return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
       <Card>
        <CardHeader>
          <CardTitle>{eventDetails.name}</CardTitle>
          <CardDescription>
            Please click to confirm whether you will be able to go to the event.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
               <h2>
                   You are invivted for awesome Party!
                   </h2>
                <Label htmlFor="email">Date:{eventDetails.date}</Label>
                 <Label htmlFor="email">Time: {eventDetails.time}</Label>
                  <Label htmlFor="email"> Location: {eventDetails.location}</Label>
          </div>
            <div className="flex flex-col gap-3">
          <Button onClick={() => handleRSVP('Accepted')} >Accept</Button>
           <Button onClick={() => handleRSVP('Declined')}>Decline</Button>
          </div>
             </div>
        </CardContent>
           </Card>
          </div>
          </div>
  )
}