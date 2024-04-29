export const debounce = (cb: Function, timeout = 500) => {
    let timer: string | number | NodeJS.Timeout;

    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => cb.apply(this, args), timeout)
    }
}