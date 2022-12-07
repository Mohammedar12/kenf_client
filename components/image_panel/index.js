const Images = props => {
    const { classnames, src, alt, width, height } = props;

    return (
        <picture>
            <img src={src} className={classnames} alt={alt} width={width} height={height} />
        </picture>
    )
}

export default Images;