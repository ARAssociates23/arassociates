
import React from "react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Save, X } from "lucide-react";

interface FormActionsProps {
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditing }) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <SheetClose asChild>
        <Button variant="outline" type="button">
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
      </SheetClose>
      <Button type="submit">
        <Save className="h-4 w-4 mr-1" /> {isEditing ? 'Update' : 'Save'} Investor
      </Button>
    </div>
  );
};

export default FormActions;
