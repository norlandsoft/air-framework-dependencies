const realConsoleError = console.error;
const realConsoleWarn = console.warn;

const suppressedMessages = [
    'Warning: findDOMNode is deprecated',
    'findDOMNode is deprecated',
    'Support for defaultProps will be removed from function components',
    'Warning: An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function',
    'Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?',
    'Warning: [antd: notification] Static function can not consume context like dynamic theme. Please use \'App\' component instead.',
    'Warning: [antd: Card] `bodyStyle` is deprecated',
    'Warning: Received `false` for a non-boolean attribute `block`',
    'Warning: React does not recognize the `streamStatus` prop'
];

function shouldSuppress(message) {
    if (!message) return false;
    const messageStr = typeof message === 'string' ? message : String(message);
    return suppressedMessages.some(suppressed => messageStr.includes(suppressed));
}

console.error = function (...args) {
    if (shouldSuppress(args[0])) {
        return;
    }
    realConsoleError.apply(console, args);
};

console.warn = function (...args) {
    if (shouldSuppress(args[0])) {
        return;
    }
    realConsoleWarn.apply(console, args);
};
