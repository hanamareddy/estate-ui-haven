
import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3 top-2.5 text-muted-foreground"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
