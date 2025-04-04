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
  show?: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


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
        console.log("eventDetails.show:", response.event)

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
    return <>
      <div className="h-screen w-screen flex items-center justify-center">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!eventDetails) {
    return <p>Event details not found.</p>
  }

  if (eventDetails.show === 'no') {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardContent>
              <p>Your response has been recorded.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>{eventDetails.name}</CardTitle>
            <CardDescription>
              Please click to confirm whether you will be able to go to the
              event.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <h2>You are invited for this event!</h2>
                <Label htmlFor="email">Date: {formatDate(eventDetails.date)}</Label>
                <Label htmlFor="email">Time: {eventDetails.time}</Label>
                <Label htmlFor="email">Location: {eventDetails.location}</Label>
              </div>
              <div className="flex flex-col gap-3">
                <Button className='cursor-pointer' onClick={() => handleRSVP('Accepted')}>Accept</Button>
                <Button className='cursor-pointer' onClick={() => handleRSVP('Declined')}>Decline</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}