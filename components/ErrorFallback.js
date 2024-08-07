import React from "react";
import { Alert } from "@mui/material";
import clsx from "clsx";
import Button from "./Button";

function ErrorFallback({ error }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[50vh] m-auto gap-3"
    >
      <Alert
        className="!mb-3 bg-red-50"
        icon={
          <img
            src="/error.svg"
            alt="Error"
            className={clsx("h-6 w-6", "-mr-1")}
          />
        }
        variant="outlined"
        severity="error"
      >
        <p className="text-body2 text-grey-900">Something went wrong.</p>
        <span className="text-body2 text-grey-900">
          {error?.message || error?.error || error}
        </span>
      </Alert>
      <Button type="button" size="sm" onClick={handleRefresh}>
        Back to Home
      </Button>
    </div>
  );
}

export default ErrorFallback;
