import React from 'react';

const Spinner = () => {
    return (
        <>
            <div className="background">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
            <style jsx>{`
                .background {
                    width: 100vw;
                    height: 100vh;
                    position: absolute;
                    background-color: rgb(228, 215, 199);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                body {
                    background-color: rgb(228, 215, 199);
                }

                .spinner {
                    text-align: center;
                }
                  
                .spinner > div {
                    width: 18px;
                    height: 18px;
                    margin: 5px !important;
                    background-color: rgba(32, 32, 32, 0.5);
                  
                    border-radius: 100%;
                    display: inline-block;
                    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                }
                  
                .spinner .bounce1 {
                    -webkit-animation-delay: -0.32s;
                    animation-delay: -0.32s;
                }
                  
                .spinner .bounce2 {
                    -webkit-animation-delay: -0.16s;
                    animation-delay: -0.16s;
                }
                  
                @-webkit-keyframes sk-bouncedelay {
                    0%, 80%, 100% { -webkit-transform: scale(0) }
                    40% { -webkit-transform: scale(1.0) }
                }
                  
                @keyframes sk-bouncedelay {
                    0%, 80%, 100% { 
                        -webkit-transform: scale(0);
                        transform: scale(0);
                    } 40% { 
                        -webkit-transform: scale(1.0);
                        transform: scale(1.0);
                    }
                }
            `}</style>
        </>
    )
}

export default Spinner;