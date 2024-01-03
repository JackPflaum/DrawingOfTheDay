import Images from '.components/Images';

const ImagesGrid = () => {
    return (
        <>
            <div className="d-flex? row">
                <select>
                    <option>Date options</option>
                </select>
                <select>
                        <option>Order options</option>
                </select>
            </div>
            <Images />
        </>
    );
};

export default ImagesGrid;