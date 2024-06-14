type Weekday = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default (targetDay: Weekday, today = new Date()) => {
    const todaysWeekday = today.getDay();
    const targetWeekday = weekdays.indexOf(targetDay);

    let daysUntilTargetDay = targetWeekday - todaysWeekday;
    daysUntilTargetDay = daysUntilTargetDay < 0 ? daysUntilTargetDay + 7 : daysUntilTargetDay;

    const targetDate = new Date(today.getTime() + (daysUntilTargetDay * 24 * 60 * 60 * 1000))
        .toISOString()
        .match(/[^T]+/);

    return (targetDate as RegExpMatchArray)[0];
}