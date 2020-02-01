export { Log }

class Log
{
    public static message(message: string, group: string) : void
    {
        console.log('Omozon - ' + group + ": " + message);
    }
    public static error(message: string) : void
    {
        console.error('Omozon Error: ' + message);
    }
}