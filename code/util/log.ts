export { Log }

class Log
{
    public static error(message: string) : void
    {
        console.error('Omozon Error: ' + message);
    }
}