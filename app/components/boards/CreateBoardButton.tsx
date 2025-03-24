import { useRouter } from "@tanstack/react-router";
import { createBoardFn } from "~/lib/services/boards";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/modal";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const CreateBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const router = useRouter();

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;

    const { id } = await createBoardFn({ data: { name: boardName } });
    setBoardName("");
    setIsOpen(false);
    router.navigate({ to: "/board/$boardId", params: { boardId: id } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-700 hover:bg-cyan-800">Create Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter board name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateBoard();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreateBoard} disabled={!boardName.trim()} className="bg-cyan-700 hover:bg-syan-800">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
