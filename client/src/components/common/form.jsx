import React from "react";

// Importing reusable UI components
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

/**
 * A common dynamic form component that renders form inputs based on config
 * Props:
 * - formControls: Array of input config objects
 * - formData: Current form data (state)
 * - setFormData: Function to update form data
 * - onSubmit: Submit handler function
 * - buttonText: Button label text
 */
const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) => {
  /**
   * Render form input based on its component type
   * @param {Object} getCtrlItem - form control object
   * @returns {JSX.Element}
   */
  function renderInputsByComponentType(getCtrlItem) {
    let element = null;
    const value = formData[getCtrlItem.name] || "";

    switch (getCtrlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getCtrlItem.name}
            placeholder={getCtrlItem.placeholder}
            id={getCtrlItem.name}
            type={getCtrlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getCtrlItem.name]: e.target.value })
            }
          />
        );
        break;

      case "select":
        element = (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [getCtrlItem.name]: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getCtrlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getCtrlItem.options && getCtrlItem.options.length > 0
                ? getCtrlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getCtrlItem.name}
            placeholder={getCtrlItem.placeholder}
            id={getCtrlItem.id}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getCtrlItem.name]: e.target.value })
            }
          />
        );
        break;

      default:
        // Default to Input if type is unknown
        element = (
          <Input
            name={getCtrlItem.name}
            placeholder={getCtrlItem.placeholder}
            id={getCtrlItem.name}
            type={getCtrlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getCtrlItem.name]: e.target.value })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {/* Loop through all control configs and render UI */}
        {formControls.map((ctrlItem) => (
          <div key={ctrlItem.name} className="grid w-full gap-1.5">
            <Label className="mb-1">{ctrlItem.label} :</Label>
            {renderInputsByComponentType(ctrlItem)}
          </div>
        ))}
      </div>

      {/* Submit button */}
      <Button type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
