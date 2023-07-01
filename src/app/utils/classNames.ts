const classNames = (...classes: (string | null)[]) => {
    return classes.filter(Boolean).join(' ');
};

export default classNames