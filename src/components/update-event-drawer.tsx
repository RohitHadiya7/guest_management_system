"use client"

import * as React from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateEvent } from "@/lib/api"
import { toast } from "sonner"
import { useMediaQuery } from "@/hooks/use-media-query"
import { z } from "zod"

const eventSchema = z.object({
  _id: z.string(),
  name: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
})

interface UpdateEventDrawerProps {
  item: z.infer<typeof eventSchema>
  open: boolean          
  setOpen: (open: boolean) => void 
  onEventUpdated: () => void
}

export function UpdateEventDrawer({ item, open, setOpen, onEventUpdated }: UpdateEventDrawerProps) {
  const [name, setName] = React.useState(item?.name || "")
  const [date, setDate] = React.useState(item?.date || "")
  const [time, setTime] = React.useState(item?.time || "")
  const [location, setLocation] = React.useState(item?.location || "")
  const isDesktop = useMediaQuery("(min-width: 768px)")  

  
  React.useEffect(() => {
    setName(item?.name || "")
    setDate(item?.date || "")
    setTime(item?.time || "")
    setLocation(item?.location || "")
  }, [item]) 

  const handleUpdateEvent = async () => {
    try {
      const token = localStorage.getItem("jwt")
      if (!token) {
        console.error("No JWT found")
        toast.error("Unauthorized: No JWT found.")
        return
      }

      const updatedEventData = {
        name,
        date,
        time,
        location,
      }

      await updateEvent(item._id, token, updatedEventData)
      toast.success("Event updated successfully!")
      onEventUpdated()
      setOpen(false)

    } catch (error: any) {
      console.error("Error updating event:", error)
      toast.error(error.message || "Failed to update event")
    }
  }

  const EventForm = () => (
    <div className="flex flex-col gap-4 p-4">
      <Label htmlFor="name">Event Name</Label>
      <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

      <Label htmlFor="date">Date</Label>
      <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <Label htmlFor="time">Time</Label>
      <Input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} />

      <Label htmlFor="location">Location</Label>
      <Input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details below:</DialogDescription>
          </DialogHeader>
          {EventForm()}
          <div className="flex justify-end gap-2 pt-6">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleUpdateEvent}>Update Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  // mobile
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Event</DrawerTitle>
          <DrawerDescription>Update event details below:</DrawerDescription>
        </DrawerHeader>
        {EventForm()}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
          <Button onClick={handleUpdateEvent} className="mb-2">Update Event</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}