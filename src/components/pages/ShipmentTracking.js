import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ShipmentTracking.css";

const ShipmentTracking = () => {
    const { consignmentNumber } = useParams();
    const navigate = useNavigate();
    const decodedConsignmentNumber = decodeURIComponent(consignmentNumber);
    const trackingData = JSON.parse(localStorage.getItem("trackingData"));

    useEffect(() => {
        if (!trackingData || !trackingData.book_gr || trackingData.book_gr.length === 0) {
            navigate("/");
        }
    }, [trackingData, navigate]);

    if (!trackingData || !trackingData.book_gr || trackingData.book_gr.length === 0) {
        return <div>Tracking information not found.</div>;
    }

    const bookGR = trackingData.book_gr[0];

    const determineStatus = (shipment) => {
        if (shipment.pod) {
            return "Delivered";
        } else if (shipment.challan && !shipment.pod) {
            return "In Transit";
        } else if (shipment.challan && !shipment.vehicle_moved) {
            return "Dispatched";
        } else if (shipment.gr_entry && !shipment.vehicle_assigned) {
            return "Pending";
        } else {
            return "Unknown";
        }
    };

    const status = determineStatus(bookGR);

    const handlePrint = () => {
        window.print()
    };

    return (
        <div className="shipment-container-ship">
            <button className="print-button-ship" onClick={handlePrint}>Print</button>
            <h2 className="header-ship">
                Waybill No: {bookGR.gr_id} | GR No: {bookGR.gr_no}
            </h2>

            <div className="shipment-details-ship">
                <table className="shipment-table-ship">
                    <tbody>
                        <tr>
                            <td className="table-header-ship">GR No.</td>
                            <td className="table-data-ship">{bookGR.gr_no}</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">Booking Date</td>
                            <td className="table-data-ship">{bookGR.gr_date}</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">No. of Packages</td>
                            <td className="table-data-ship">{bookGR.t_pkg}</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">Weight</td>
                            <td className="table-data-ship">{bookGR.act_wt} kg</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">From</td>
                            <td className="table-data-ship">{bookGR.source}</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">To</td>
                            <td className="table-data-ship">{bookGR.destination}</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">Booking Mode</td>
                            <td className="table-data-ship">{bookGR.mode}</td>
                        </tr>
                        <tr>
                            <td className="table-header-ship">Status</td>
                            <td className="table-data-ship">{status}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShipmentTracking;