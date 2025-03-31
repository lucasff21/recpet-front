export const useFieldValidation = (id, errors) => {
    const getErrorMessage = () => {
        if (!errors) return null;

        const path = id.split('.');
        let current = errors;

        for (const part of path) {
            if (!current) break;
            current = current[part];
        }

        return Array.isArray(current?._errors)
            ? current._errors[0]
            : current?.message || current;
    };

    return {
        errorMessage: getErrorMessage(),
        hasError: !!getErrorMessage(),
    };
};