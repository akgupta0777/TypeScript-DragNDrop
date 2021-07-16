// Validation
export interface Validatable {
    propertyName: string;
    value: string | number;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validationOf(validatableInput : Validatable){
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && (validatableInput.value.toString().trim().length !== 0);
        if(!isValid) console.log("Reason : Value is required!");
    }
    if(validatableInput.minLength && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        if(!isValid) console.log("Reason : minimum length is not maintained");
    }
    if(validatableInput.maxLength && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        if(!isValid) console.log("Reason : maximum length is not maintained");
    }
    if(validatableInput.min){
        isValid = isValid && (+validatableInput.value >= validatableInput.min);
        if(!isValid) console.log("Reason : minimum value is not maintained ");
    }
    if(validatableInput.max){
        isValid = isValid && (+validatableInput.value <= validatableInput.max);
        if(!isValid) console.log("Reason : maximum value is not maintained");
    }
    if(!isValid) console.log("Error in : ",validatableInput.propertyName);
    return isValid;
}