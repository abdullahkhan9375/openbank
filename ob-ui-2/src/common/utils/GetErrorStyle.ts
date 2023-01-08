export const getErrorStyle = (aHasChanged: boolean, aError: boolean, aCSS: "BORDER" | "OPACITY") =>
{
    if (aCSS === "BORDER")
    {
        if (!aHasChanged) return "border-b-black";
        return aError ? "border-b-red" : "border-b-green";
    }
    if (aError && aHasChanged) return "opacity-1";
    return "opacity-0";
};
