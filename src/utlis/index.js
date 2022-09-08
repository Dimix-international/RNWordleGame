
export const copyArray = (arr) => {
    return [...arr.map(rows => [...rows])]
}

export const getDayOfTheYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};


export const getDayKey = () => `day-${getDayOfTheYear()}-${new Date().getFullYear()}`;
