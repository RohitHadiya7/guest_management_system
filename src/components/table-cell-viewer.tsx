"use client"

import * as React from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { useIsMobile } from "@/hooks/use-mobile"
import { getGuests } from "@/lib/api"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { inviteGuest } from "@/lib/api"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter as DialogFooterUI,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const eventSchema = z.object({
    _id: z.string(),
    name: z.string(),
    date: z.string(),
    time: z.string(),
    location: z.string(),
})

interface TableCellViewerProps {
    item: z.infer<typeof eventSchema>
    onGuestInvited?: () => void 
}

interface Guest {
    _id: string
    email: string
    rsvpStatus: string
}

export function TableCellViewer({ item, onGuestInvited }: TableCellViewerProps) {
    const isMobile = useIsMobile()
    const [guests, setGuests] = useState<Guest[]>([])
    const [open, setOpen] = React.useState(false)
    const [inviteEmail, setInviteEmail] = useState('') // state for guest email
    const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false)


    useEffect(() => {
        const fetchGuestsData = async () => {
            try {
                const token = localStorage.getItem("jwt")
                if (!token) {
                    console.error("No JWT found")
                    return
                }
                const guestsData = await getGuests(item._id, token)
                setGuests(guestsData)
            } catch (error) {
                console.error("Error fetching guests:", error)
            }
        }
        fetchGuestsData()
    }, [item._id])

    const handleInviteGuest = async () => {
        try {
            const token = localStorage.getItem("jwt")
            if (!token) {
                console.error("No JWT found")
                return
            }

            await inviteGuest({ eventId: item._id, email: inviteEmail }, token)
            toast.success(`Invitation sent to ${inviteEmail}!`)
            setInviteEmail('')
            setInviteDialogOpen(false)
            onGuestInvited() // Refresh guest list in data table

        } catch (error: any) {
            console.error("Error inviting guest:", error)
            toast.error(error.message || "Failed to invite guest.")
        }
    }


    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.name}</DrawerTitle>
                    <DrawerDescription>Guests</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-2 p-4">
                    {guests.length > 0 ? (
                        guests.map((guest) => (
                            <div key={guest._id} className="flex items-center justify-between">
                                <Label>{guest.email}</Label>
                                <span>{guest.rsvpStatus}</span>
                            </div>
                        ))
                    ) : (
                        <p>No guests invited yet.</p>
                    )}
                        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Invite Guests</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Invite Guest</DialogTitle>
                                    <DialogDescription>Enter guest's email below to invite them.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input
                                            id="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                 <DialogFooterUI>
                                        <Button type="button" variant="secondary" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit" onClick={handleInviteGuest}>Invite</Button>
                                    </DialogFooterUI>
                            </DialogContent>
                        </Dialog>

                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="secondary">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}