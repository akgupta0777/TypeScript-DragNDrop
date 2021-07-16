// AutoBind Decorator that is used for binding 'this' to local bounded functions.
export default function autoBind(
    target:any,
    methodName:String,
    descriptor:PropertyDescriptor
){
    const originalMethod = descriptor.value;
    const adjustableDescriptor: PropertyDescriptor = {
        configurable : true,
        get(){            
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjustableDescriptor;
}
