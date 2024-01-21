import { useEffect } from 'react';

// this custom hook detects clicks outside of a modal or dropdown box and calls setOpenModal(false) (i.e. updater)
export const useOnClickOutside = (ref, currentState, updater) => {
    useEffect(() => {
        const handler = (e) => {
            // if modal or dropdown is open (currentState=true), ref.current is available and not null,
            // and the user has clicked outside ref then set updater function (i.e useState setter) to false.
            if (currentState && ref.current && !ref.current.contains(e.target)) {
                updater();
            };
        };

        // call handler function when "mousedown" event occurs anywhere on the document
        document.addEventListener("mousedown", handler);

        // cleanup event listener
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, currentState, updater]);
};