import { useState } from "react";

export const useResize = () => {
    const [responsive, setResponsive] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
        isSmallScreen: window.innerWidth <= 450
    })

    window.onresize = () => {
        setResponsive({
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= 768,
            isSmallScreen: window.innerWidth <= 450
        })
    }

    return responsive;
}