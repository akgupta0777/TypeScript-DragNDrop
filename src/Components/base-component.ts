export default abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(templateId: string,hostId: string,insert:InsertPosition, newElementId?: string){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostId)! as T;

        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as U;
        if(newElementId)
            this.element.id = newElementId;
        this.attach(insert);
    }
    private attach(insert: InsertPosition){
        this.hostElement.insertAdjacentElement(insert,this.element);
    }
    abstract configure(): void;
    abstract renderContent(): void;
    
}