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
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createEvent } from "@/lib/api"
import { toast } from "sonner"
import { IconPlus } from "@tabler/icons-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface AddEventDrawerProps {
    userId: string | null
    onEventCreated: () => void
}

export function AddEventDrawer({ userId, onEventCreated }: AddEventDrawerProps) {
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState('')
    const [date, setDate] = React.useState('')
    const [time, setTime] = React.useState('')
    const [location, setLocation] = React.useState('')
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handleCreateEvent = async () => {
        if (!userId) {
            console.warn("No userId provided to AddEventDrawer")
            return
        }

        try {
            const token = localStorage.getItem("jwt")
            if (!token) {
                console.error("No JWT found")
                return
            }
            await createEvent(name, date, time, location, token)

            toast.success("Event created successfully!")
            onEventCreated()

            setOpen(false)
            setName('')
            setDate('')
            setTime('')
            setLocation('')


        } catch (error: any) {
            console.error("Error creating event:", error)
            toast.error(error.message || "Failed to create event")
        }
    }


    const renderFormContent = () => (
        <div className="flex flex-col gap-4 p-4">
            <Label htmlFor="name">Event Name</Label>
            <Input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />

            <Label htmlFor="date">Date</Label>
            <Input 
                type="date" 
                id="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
            />

            <Label htmlFor="time">Time</Label>
            <Input 
                type="time" 
                id="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
            />

            <Label htmlFor="location">Location</Label>
            <Input 
                type="text" 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
            />
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <IconPlus />
                        <span className="hidden lg:inline">Add Event</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription>Fill in the information below</DialogDescription>
                    </DialogHeader>
                    {renderFormContent()}
                    <div className="flex justify-end gap-2 pt-6">
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleCreateEvent}>Create Event</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Event</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create New Event</DrawerTitle>
                    <DrawerDescription>Fill in the information below</DrawerDescription>
                </DrawerHeader>
                {renderFormContent()}
                <DrawerFooter className="pt-2">
                    <Button onClick={handleCreateEvent} className="mb-2">Create Event</Button>
                    <DrawerClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}