export { Log }

class Log
{
    public static suppressMessages: any = {};
    public static logErrors: boolean = true;
    public static message(message: string, group: string) : void
    {
        if(Log.suppressMessages[group])
        {
            return;
        }
        console.log('Omozon - ' + group + ": " + message);
    }
    public static error(message: string) : void
    {
        if(!Log.logErrors)
        {
            return;
        }
        console.error('Omozon Error: ' + message);
    }
}