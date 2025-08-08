export class BundleState<T>
{
    private value
    private setter

    constructor(value: T, setter: React.Dispatch<React.SetStateAction<T>>)
    {
        this.value = value
        this.setter = setter
    }

    public get get()
    {
        return this.value
    }

    public set set(newValue: T)
    {
        this.setter(newValue)
    }
}