import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import Chip from "../../components/chip/Chip"
import { SECTOR } from "../../types/PreferredSector"
import { toast } from "react-hot-toast"

const topics = SECTOR

type TopicSelectionModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (selected: string[]) => void
  initialTopics?: string[]
}

export default function TopicSelectionModal({
  isOpen,
  onClose,
  onSubmit,
  initialTopics = [],
}: TopicSelectionModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics)

  useEffect(() => {
    setSelectedTopics(initialTopics)
  }, [initialTopics])

  const handleSelect = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic))
    } else if (selectedTopics.length < 4) {
      setSelectedTopics([...selectedTopics, topic])
    } else {
      toast.error("You can select only 4 topics.")
    }
  }

  const handleSave = () => {
    if (selectedTopics.length !== 4) {
      toast.error("Please select exactly 4 topics.")
      return
    }
    onSubmit(selectedTopics)
    toast.success("Topics saved successfully!")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[90%] max-w-[600px] sm:max-w-[700px]
          p-4 sm:p-6 md:p-8
          rounded-2xl
        "
      >
        <DialogHeader>
          <DialogTitle
            className="
              text-center text-xl sm:text-2xl md:text-3xl font-bold
              text-foreground
            "
          >
            Build Your Personalized Feed
          </DialogTitle>
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-1">
            Pick 4 Topics You Love!
          </p>
        </DialogHeader>

        <Card className="shadow-md rounded-xl border-none mt-4">
          <CardContent
            className="
              flex flex-wrap justify-center gap-2 sm:gap-3
              p-3 sm:p-5 md:p-6
            "
          >
            {topics.map((topic) => (
              <Chip
                key={topic}
                selected={selectedTopics.includes(topic)}
                onClick={() => handleSelect(topic)}
              >
                {topic}
              </Chip>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-5 sm:mt-6">
          <Button
            onClick={handleSave}
            className="
              rounded-lg bg-blue-500 hover:bg-blue-700
              w-32 sm:w-40 md:w-44
              text-sm sm:text-base
            "
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
