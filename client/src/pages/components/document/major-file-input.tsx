import { AiOutlinePlus } from "solid-icons/ai";
import { cn } from "../../../utils/tailwind";
import toast from "solid-toast";

type MajorFileInputProps = {
  onFileSelect: (files: File[]) => void;
};

const allowedFileTypes = ["application/pdf"];

const validateFile = (file: File) => {
  if (!allowedFileTypes.includes(file.type)) {
    throw new Error("Invalid file type!");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File size exceeds the limit of 10MB!");
  }
};

export default function MajorFileInput({ onFileSelect }: MajorFileInputProps) {
  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      try {
        validateFile(files[i]);
      } catch (error) {
        const errorMessage = `Error with file "${files[i].name}": ${
          (error as Error).message
        }`;
        toast.error(errorMessage);
      }
    }

    onFileSelect(Array.from(files));
  };

  return (
    <>
      <input
        type="file"
        id="major-file-input"
        hidden
        onChange={(e) => handleFileChange(e.currentTarget.files)}
      />
      <label
        for="major-file-input"
        class={cn(
          "flex justify-center items-center cursor-pointer ",
          "w-[300px] h-[300px] rounded-[50%] bg-primary-600/75 text-white",
          "transition shadow-xl shadow-primary-700 hover:shadow-2xl hover:scale-[110%]"
        )}
      >
        <AiOutlinePlus size={180} />
      </label>
    </>
  );
}
