import React from "react";

const Order = (props) => {
    return (
    <div className="card m-3 max-w-xl">
    <div className="row g-0">
        <div className="col-md-4">
        <img src="public/next.svg" className="img-fluid rounded-start" alt="..."/>
        </div>
        <div className="col-md-8">
        <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional </p>
            <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
        </div>
        </div>
    </div>
    </div>
    );
}

export default Order;
