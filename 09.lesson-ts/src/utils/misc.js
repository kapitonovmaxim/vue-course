const dollar_to_rub = 78.39;

export const formatPriceToRub = (price) => {
    if (price) {
        return `${(price * dollar_to_rub).toFixed(0).toLocaleString('ru-RU')} ₽`;
    } else {
        return 'Нет в наличии';
    }
}
