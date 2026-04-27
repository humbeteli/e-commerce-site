import {useState} from 'react'
export const useAddToCartFeedBack = () => {
    const [added, setAdded] = useState(false);
    const trigger = () => {
        setAdded(true);
        setTimeout(() => setAdded(false),
    1500)
    };
    return {added, trigger}
}