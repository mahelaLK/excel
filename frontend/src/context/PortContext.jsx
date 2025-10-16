import React from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import XLSX from "xlsx-js-style";

export const PortContext = createContext();

const PortContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [voyageNames, setVoyageNames] = useState([]);
  const [vesselNames, setVesselNames] = useState([]);
  const [gangDetails, setGangDetails] = useState(null);
  const [gangDetailCars, setGangDetailCars] = useState(null);

  const getAllVoyageNames = async (vesselName) => {
    try {
      const response = await axios.get(backendUrl + `/api/voyagenames/${vesselName}`);
      if (response.data.success) {
        setVoyageNames(response.data.voyageNames.recordset);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllVesselNames = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/vesselnames");
      if (response.data.success) {
        setVesselNames(response.data.vesselNames.recordset);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGangDetails = async (inwardVoyage) => {
    try {
      const response = await axios.get(
        backendUrl + `/api/gangplandetails/${inwardVoyage}`
      );
      if (response.data.success) {
        setGangDetails(response.data.details);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGangDetailsCar = async (inwardVoyage) => {
    try {
        const response = await axios.get(
            backendUrl + `/api/gangplandetailcars/${inwardVoyage}`
        );
        if (response.data.success) {
            setGangDetailCars(response.data.details);
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
  }

  const exportTableStyledCar = async (vesselName) => {
    try {
        const wb = XLSX.utils.book_new();
        const wsData = [];

        const createEmptyCells = (count) =>
        Array(count).fill({
            v: "",
            s: {
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });

        const numGangs = gangDetailCars.gangPlanDetails.length;
        const totalCols = 2 + numGangs * 4;

        // Row 1: Voyage with proper styling
        wsData.push([
        {
            v: `VESSEL NAME/VOYAGE: ${vesselName}`,
            s: {
            font: {
                bold: true,
                underline: true,
                sz: 16,
                color: { rgb: "FFFFFF" },
            },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ...createEmptyCells(totalCols - 1),
        ]);

        // Row 2: Berthside with styling
        wsData.push([
        {
            v: `Berthside: ${gangDetailCars.berthSide}`,
            s: {
            font: { bold: true, sz: 12 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ...createEmptyCells(totalCols - 1),
        ]);

        // Row 3: Gang headers with styling
        const gangRow = [
        {
            v: "Gang",
            s: {
            font: { bold: true, sz: 11 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        gangDetailCars.gangPlanDetails.forEach((plan) => {
        gangRow.push({
            v: plan.gangNumber,
            s: {
            font: { bold: true, sz: 11 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        gangRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        ); // Empty cells for colspan effect
        });
        wsData.push(gangRow);

        // Row 4: Crane with styling
        const craneRow = [
        {
            v: "Crane",
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        gangDetailCars.gangPlanDetails.forEach((plan) => {
        craneRow.push({
            v: plan.details.Crane,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        craneRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        );
        });
        wsData.push(craneRow);

        // Row 5: Bays with styling
        const baysRow = [
        {
            v: "Bays",
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        gangDetailCars.gangPlanDetails.forEach((plan) => {
        baysRow.push({
            v: plan.details.ListOfBays,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        baysRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        );
        });
        wsData.push(baysRow);

        // Rows 6-9: Discharge, Overstow, Restow, Loads with styling
        const metrics = ["Discharge", "Overstow", "Restow", "Loads"];
        metrics.forEach((metric) => {
        const row = [
            {
            v: metric,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "F2F2F2" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        let total = 0;
        gangDetailCars.gangPlanDetails.forEach((plan) => {
            const value = Number(plan.details[metric]) || 0;
            total += value;
            row.push({
            v: value,
            s: {
                font: { sz: 10 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
            row.push(
            {
                v: "",
                s: {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            {
                v: "",
                s: {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            }
            );
        });

        row.push({
            v: total,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        row.push(...createEmptyCells(numGangs));
        wsData.push(row);
        });

        // Row 10: No of Lifts with styling
        const liftsRow = [
        {
            v: "No of Lifts",
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "F2F2F2" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        let totalLifts = 0;
        gangDetailCars.gangPlanDetails.forEach((plan) => {
        const lifts =
            (Number(plan.details.Loads) || 0) +
            (Number(plan.details.Restow) || 0) +
            (Number(plan.details.Overstow) || 0) +
            (Number(plan.details.Discharge) || 0);
        totalLifts += lifts;
        liftsRow.push({
            v: lifts,
            s: {
            font: { sz: 10 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        liftsRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        );
        });

        liftsRow.push({
        v: totalLifts,
        s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
            },
        },
        });
        liftsRow.push(...createEmptyCells(numGangs));
        wsData.push(liftsRow);

        // Define merges (same as before)
        const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
        ];

        for (let i = 0; i < numGangs; i++) {
        merges.push({ s: { r: 2, c: 1 + i * 3 }, e: { r: 2, c: 3 + i * 3 } });
        }

        for (let row = 3; row <= 4; row++) {
        for (let i = 0; i < numGangs; i++) {
            merges.push({
            s: { r: row, c: 1 + i * 3 },
            e: { r: row, c: 3 + i * 3 },
            });
        }
        }

        for (let row = 5; row <= 9; row++) {
        for (let i = 0; i < numGangs; i++) {
            merges.push({
            s: { r: row, c: 1 + i * 3 },
            e: { r: row, c: 3 + i * 3 },
            });
        }
        merges.push({
            s: { r: row, c: 1 + numGangs * 3 },
            e: { r: row, c: totalCols - 1 },
        });
        }

        // Continue with shift details (add styling to these as well)...
        const globalRunning = gangDetailCars.gangPlanDetails.map(() => 0);
        const allShifts = [
        ...new Set(
            gangDetailCars.gangPlanDetails.flatMap((g) =>
            g.shiftPlanDetails.map((s) => s.ShiftNumber)
            )
        ),
        ];

        allShifts.forEach((shiftNo) => {
        const firstShift = gangDetailCars.gangPlanDetails[0].shiftPlanDetails.find(
            (s) => s.ShiftNumber === shiftNo
        );
        const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];

        const cumulativeByGang = gangDetailCars.gangPlanDetails.map(
            (plan, gangIdx) => {
            const shift = plan.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
            );
            const ltPlan = shift?.liftTimePlanDetails ?? [];
            let running = globalRunning[gangIdx];
            const rows = [];

            for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
                const lt = ltPlan[idx];
                const details = lt?.Details?.[0];
                const hasTarget =
                details &&
                details.Target != null &&
                String(details.Target).trim() !== "";
                const hasActual =
                details &&
                details.Actual != null &&
                String(details.Actual).trim() !== "";

                if (hasTarget || hasActual) {
                const tNum = hasTarget ? Number(details.Target) : 0;
                const aNum = hasActual ? Number(details.Actual) : 0;
                const delta = aNum - tNum;
                running += delta;
                rows.push({
                    targetRaw: details.Target,
                    actualRaw: details.Actual,
                    cumulative: running,
                });
                } else {
                rows.push({
                    targetRaw: null,
                    actualRaw: null,
                    cumulative: running,
                });
                }
            }
            globalRunning[gangIdx] = running;
            return rows;
            }
        );

        // Shift header row with styling
        const shiftHeaderRow = [
            {
            v: `SHIFT ${shiftNo}`,
            s: {
                font: { bold: true, sz: 12 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            ...createEmptyCells(numGangs * 3),
            {
            v: "Remarks",
            s: {
                font: { bold: true, sz: 11 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: `SHIFT ${shiftNo} SHIP SUPERVISOR: ${
                firstShift?.Supervisor ?? "-"
            }`,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            ...createEmptyCells(numGangs - 1),
        ];

        wsData.push(shiftHeaderRow);
        merges.push({
            s: { r: wsData.length - 1, c: 0 },
            e: { r: wsData.length - 1, c: numGangs * 3 },
        });
        merges.push({
            s: { r: wsData.length - 1, c: numGangs * 3 + 1 },
            e: { r: wsData.length, c: numGangs * 3 + 1 },
        });
        merges.push({
            s: { r: wsData.length - 1, c: numGangs * 3 + 2 },
            e: { r: wsData.length - 1, c: totalCols - 1 },
        });

        // Date + headers row with styling
        const dateStr = firstShift?.ShiftStartDate
            ? (() => {
                const d = new Date(firstShift.ShiftStartDate);
                return `${String(d.getDate()).padStart(2, "0")}/${String(
                d.getMonth() + 1
                ).padStart(2, "0")}/${d.getFullYear()}`;
            })()
            : "-";

        const dateRow = [
            {
            v: dateStr,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        gangDetailCars.gangPlanDetails.forEach((plan) => {
            const shift = plan.shiftPlanDetails.find(
            (s) => s.ShiftNumber === shiftNo
            );
            if (shift) {
            ["Target", "Actual", "Variance"].forEach((header) => {
                dateRow.push({
                v: header,
                s: {
                    font: { bold: true, sz: 9 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            });
            } else {
            dateRow.push({
                v: "-",
                s: {
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });
            dateRow.push("", "");
            }
        });

        dateRow.push(""); // Remarks column (merged above)
        gangDetailCars.gangPlanDetails.forEach((plan) => {
            dateRow.push({
            v: plan.details.Crane,
            s: {
                font: { bold: true, sz: 9 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
        });
        wsData.push(dateRow);

        // Shift data rows with basic styling
        baselineLiftTimes.forEach((lt, i) => {
            const dataRow = [
            {
                v: lt?.LiftTime ?? "-",
                s: {
                font: { sz: 9 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ];

            gangDetailCars.gangPlanDetails.forEach((plan, gangIdx) => {
            const cell = cumulativeByGang[gangIdx]?.[i] ?? {
                targetRaw: null,
                actualRaw: null,
                cumulative: globalRunning[gangIdx],
            };

            [
                cell.targetRaw != null ? cell.targetRaw : "-",
                cell.actualRaw != null ? cell.actualRaw : "-",
                cell.cumulative,
            ].forEach((value) => {
                dataRow.push({
                v: value,
                s: {
                    font: { sz: 9 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            });
            });

            const remarks =
            gangDetailCars.gangPlanDetails
                .map((plan) => {
                const crane = plan.details.Crane;
                const shift = plan.shiftPlanDetails.find(
                    (s) => s.ShiftNumber === shiftNo
                );
                const ltThis = shift?.liftTimePlanDetails[i];
                const remark = ltThis?.Details?.[0]?.Remarks;
                return remark && remark.trim() !== ""
                    ? `${crane}: ${remark}`
                    : null;
                })
                .filter(Boolean)
                .join("\n") || "-";

            dataRow.push({
            v: remarks,
            s: {
                font: { sz: 8 },
                alignment: {
                horizontal: "left",
                vertical: "center",
                wrapText: true,
                },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });

            gangDetailCars.gangPlanDetails.forEach((plan) => {
            const shift = plan.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
            );
            let staffInfo = "";

            if (i === 0) {
                staffInfo = `FM: ${shift?.Foreman ?? "-"}`;
            } else if (i === 1) {
                staffInfo = `Time Keeper: ${shift?.TK ?? "-"}`;
            } else if (i === 2) {
                staffInfo = `Drivers: ${shift?.NoOfDrivers ?? "-"}`;
            } else if (i === 3) {
                staffInfo = `Checklist: ${shift?.Checklist ?? "-"}`;
            } else if (i === 4) {
                staffInfo = `Traffic: ${shift?.Traffic ?? "-"}`;
            } else if (i === 5) {
                staffInfo = `Unlashing: ${shift?.Unlashing ?? "-"}`;
            }

            dataRow.push({
                v: staffInfo,
                s: {
                font: { sz: 8 },
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });
            });
            wsData.push(dataRow);
        });
        });

        // Summary rows with styling (Total lifts left, Productivity Rate, Est Hrs of Completion)
        const summaryRows = [
        {
            label: "Total lifts left",
            bgColor: "8497B0",
            calculation: (plan) => {
            const totalLifts =
                Number(plan.details.Discharge) +
                Number(plan.details.Overstow) +
                Number(plan.details.Restow) +
                Number(plan.details.Loads);
            const totalActual = plan.shiftPlanDetails.reduce((sum, shift) => {
                const shiftSum = (shift.liftTimePlanDetails || []).reduce(
                (s, lt) => {
                    const details = lt?.Details?.[0];
                    return s + (Number(details?.Actual) || 0);
                },
                0
                );
                return sum + shiftSum;
            }, 0);
            return totalLifts - totalActual;
            },
        },
        {
            label: "Productivity Rate",
            bgColor: "8497B0",
            calculation: (plan) => {
            let totalActual = 0,
                totalCount = 0;
            plan.shiftPlanDetails.forEach((shift) => {
                (shift.liftTimePlanDetails || []).forEach((lt) => {
                const details = lt?.Details?.[0];
                if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                }
                });
            });
            return totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
            },
        },
        {
            label: "Est Hrs of Completion",
            bgColor: "8497B0",
            calculation: (plan) => {
            let totalActual = 0,
                totalCount = 0;
            const totalLifts =
                Number(plan.details.Discharge) +
                Number(plan.details.Overstow) +
                Number(plan.details.Restow) +
                Number(plan.details.Loads);
            plan.shiftPlanDetails.forEach((shift) => {
                (shift.liftTimePlanDetails || []).forEach((lt) => {
                const details = lt?.Details?.[0];
                if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                }
                });
            });
            const productivity =
                totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
            return productivity > 0
                ? ((totalLifts - totalActual) / productivity).toFixed(0)
                : 0;
            },
        },
        ];

        summaryRows.forEach((summaryRow) => {
        const row = [
            {
            v: summaryRow.label,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        ];

        gangDetailCars.gangPlanDetails.forEach((plan) => {
            row.push({
            v: summaryRow.calculation(plan),
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: summaryRow.bgColor } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
            row.push("", "");
        });

        wsData.push(row);
        for (let i = 0; i < numGangs; i++) {
            merges.push({
            s: { r: wsData.length - 1, c: 1 + i * 3 },
            e: { r: wsData.length - 1, c: 3 + i * 3 },
            });
        }
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!merges"] = merges;

        const colWidths = [{ wch: 20 }];
        for (let i = 0; i < numGangs * 3; i++) {
        colWidths.push({ wch: 12 });
        }
        colWidths.push({ wch: 30 });
        for (let i = 0; i < numGangs; i++) {
        colWidths.push({ wch: 25 });
        }
        ws["!cols"] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Gang Details");
        XLSX.writeFile(wb, `Voyage_${gangDetailCars.inwardVoyage}.xlsx`);
    } catch (error) {
        console.log(error);
    }
  };

  const exportTableStyled = async (vesselName) => {
    try {
        const wb = XLSX.utils.book_new();
        const wsData = [];

        const createEmptyCells = (count) =>
        Array(count).fill({
            v: "",
            s: {
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });

        const numGangs = gangDetails.gangPlanDetails.length;
        const totalCols = 2 + numGangs * 4;

        // Row 1: Voyage with proper styling
        wsData.push([
        {
            v: `VESSEL NAME/VOYAGE: ${vesselName}`,
            s: {
            font: {
                bold: true,
                underline: true,
                sz: 16,
                color: { rgb: "FFFFFF" },
            },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ...createEmptyCells(totalCols - 1),
        ]);

        // Row 2: Berthside with styling
        wsData.push([
        {
            v: `Berthside: ${gangDetails.berthSide}`,
            s: {
            font: { bold: true, sz: 12 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ...createEmptyCells(totalCols - 1),
        ]);

        // Row 3: Gang headers with styling
        const gangRow = [
        {
            v: "Gang",
            s: {
            font: { bold: true, sz: 11 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        gangDetails.gangPlanDetails.forEach((plan) => {
        gangRow.push({
            v: plan.gangNumber,
            s: {
            font: { bold: true, sz: 11 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        gangRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        ); // Empty cells for colspan effect
        });
        wsData.push(gangRow);

        // Row 4: Crane with styling
        const craneRow = [
        {
            v: "Crane",
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        gangDetails.gangPlanDetails.forEach((plan) => {
        craneRow.push({
            v: plan.details.Crane,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        craneRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        );
        });
        wsData.push(craneRow);

        // Row 5: Bays with styling
        const baysRow = [
        {
            v: "Bays",
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        gangDetails.gangPlanDetails.forEach((plan) => {
        baysRow.push({
            v: plan.details.ListOfBays,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "8497B0" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        baysRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        );
        });
        wsData.push(baysRow);

        // Rows 6-9: Discharge, Overstow, Restow, Loads with styling
        const metrics = ["Discharge", "Overstow", "Restow", "Loads"];
        metrics.forEach((metric) => {
        const row = [
            {
            v: metric,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "F2F2F2" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        let total = 0;
        gangDetails.gangPlanDetails.forEach((plan) => {
            const value = Number(plan.details[metric]) || 0;
            total += value;
            row.push({
            v: value,
            s: {
                font: { sz: 10 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
            row.push(
            {
                v: "",
                s: {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            {
                v: "",
                s: {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            }
            );
        });

        row.push({
            v: total,
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        row.push(...createEmptyCells(numGangs));
        wsData.push(row);
        });

        // Row 10: No of Lifts with styling
        const liftsRow = [
        {
            v: "No of Lifts",
            s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "F2F2F2" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        },
        ];

        let totalLifts = 0;
        gangDetails.gangPlanDetails.forEach((plan) => {
        const lifts =
            (Number(plan.details.Loads) || 0) +
            (Number(plan.details.Restow) || 0) +
            (Number(plan.details.Overstow) || 0) +
            (Number(plan.details.Discharge) || 0);
        totalLifts += lifts;
        liftsRow.push({
            v: lifts,
            s: {
            font: { sz: 10 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            },
        });
        liftsRow.push(
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: "",
            s: {
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        );
        });

        liftsRow.push({
        v: totalLifts,
        s: {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
            },
        },
        });
        liftsRow.push(...createEmptyCells(numGangs));
        wsData.push(liftsRow);

        // Define merges (same as before)
        const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
        ];

        for (let i = 0; i < numGangs; i++) {
        merges.push({ s: { r: 2, c: 1 + i * 3 }, e: { r: 2, c: 3 + i * 3 } });
        }

        for (let row = 3; row <= 4; row++) {
        for (let i = 0; i < numGangs; i++) {
            merges.push({
            s: { r: row, c: 1 + i * 3 },
            e: { r: row, c: 3 + i * 3 },
            });
        }
        }

        for (let row = 5; row <= 9; row++) {
        for (let i = 0; i < numGangs; i++) {
            merges.push({
            s: { r: row, c: 1 + i * 3 },
            e: { r: row, c: 3 + i * 3 },
            });
        }
        merges.push({
            s: { r: row, c: 1 + numGangs * 3 },
            e: { r: row, c: totalCols - 1 },
        });
        }

        // Continue with shift details (add styling to these as well)...
        const globalRunning = gangDetails.gangPlanDetails.map(() => 0);
        const allShifts = [
        ...new Set(
            gangDetails.gangPlanDetails.flatMap((g) =>
            g.shiftPlanDetails.map((s) => s.ShiftNumber)
            )
        ),
        ];

        allShifts.forEach((shiftNo) => {
        const firstShift = gangDetails.gangPlanDetails[0].shiftPlanDetails.find(
            (s) => s.ShiftNumber === shiftNo
        );
        const baselineLiftTimes = firstShift?.liftTimePlanDetails ?? [];

        const cumulativeByGang = gangDetails.gangPlanDetails.map(
            (plan, gangIdx) => {
            const shift = plan.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
            );
            const ltPlan = shift?.liftTimePlanDetails ?? [];
            let running = globalRunning[gangIdx];
            const rows = [];

            for (let idx = 0; idx < baselineLiftTimes.length; idx++) {
                const lt = ltPlan[idx];
                const details = lt?.Details?.[0];
                const hasTarget =
                details &&
                details.Target != null &&
                String(details.Target).trim() !== "";
                const hasActual =
                details &&
                details.Actual != null &&
                String(details.Actual).trim() !== "";

                if (hasTarget || hasActual) {
                const tNum = hasTarget ? Number(details.Target) : 0;
                const aNum = hasActual ? Number(details.Actual) : 0;
                const delta = aNum - tNum;
                running += delta;
                rows.push({
                    targetRaw: details.Target,
                    actualRaw: details.Actual,
                    cumulative: running,
                });
                } else {
                rows.push({
                    targetRaw: null,
                    actualRaw: null,
                    cumulative: running,
                });
                }
            }
            globalRunning[gangIdx] = running;
            return rows;
            }
        );

        // Shift header row with styling
        const shiftHeaderRow = [
            {
            v: `SHIFT ${shiftNo}`,
            s: {
                font: { bold: true, sz: 12 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            ...createEmptyCells(numGangs * 3),
            {
            v: "Remarks",
            s: {
                font: { bold: true, sz: 11 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            {
            v: `SHIFT ${shiftNo} SHIP SUPERVISOR: ${
                firstShift?.Supervisor ?? "-"
            }`,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
            ...createEmptyCells(numGangs - 1),
        ];

        wsData.push(shiftHeaderRow);
        merges.push({
            s: { r: wsData.length - 1, c: 0 },
            e: { r: wsData.length - 1, c: numGangs * 3 },
        });
        merges.push({
            s: { r: wsData.length - 1, c: numGangs * 3 + 1 },
            e: { r: wsData.length, c: numGangs * 3 + 1 },
        });
        merges.push({
            s: { r: wsData.length - 1, c: numGangs * 3 + 2 },
            e: { r: wsData.length - 1, c: totalCols - 1 },
        });

        // Date + headers row with styling
        const dateStr = firstShift?.ShiftStartDate
            ? (() => {
                const d = new Date(firstShift.ShiftStartDate);
                return `${String(d.getDate()).padStart(2, "0")}/${String(
                d.getMonth() + 1
                ).padStart(2, "0")}/${d.getFullYear()}`;
            })()
            : "-";

        const dateRow = [
            {
            v: dateStr,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            },
        ];

        gangDetails.gangPlanDetails.forEach((plan) => {
            const shift = plan.shiftPlanDetails.find(
            (s) => s.ShiftNumber === shiftNo
            );
            if (shift) {
            ["Target", "Actual", "Variance"].forEach((header) => {
                dateRow.push({
                v: header,
                s: {
                    font: { bold: true, sz: 9 },
                    fill: { fgColor: { rgb: "8497B0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            });
            } else {
            dateRow.push({
                v: "-",
                s: {
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });
            dateRow.push("", "");
            }
        });

        dateRow.push(""); // Remarks column (merged above)
        gangDetails.gangPlanDetails.forEach((plan) => {
            dateRow.push({
            v: plan.details.Crane,
            s: {
                font: { bold: true, sz: 9 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
        });
        wsData.push(dateRow);

        // Shift data rows with basic styling
        baselineLiftTimes.forEach((lt, i) => {
            const dataRow = [
            {
                v: lt?.LiftTime ?? "-",
                s: {
                font: { sz: 9 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            },
            ];

            gangDetails.gangPlanDetails.forEach((plan, gangIdx) => {
            const cell = cumulativeByGang[gangIdx]?.[i] ?? {
                targetRaw: null,
                actualRaw: null,
                cumulative: globalRunning[gangIdx],
            };

            [
                cell.targetRaw != null ? cell.targetRaw : "-",
                cell.actualRaw != null ? cell.actualRaw : "-",
                cell.cumulative,
            ].forEach((value) => {
                dataRow.push({
                v: value,
                s: {
                    font: { sz: 9 },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                    },
                },
                });
            });
            });

            const remarks =
            gangDetails.gangPlanDetails
                .map((plan) => {
                const crane = plan.details.Crane;
                const shift = plan.shiftPlanDetails.find(
                    (s) => s.ShiftNumber === shiftNo
                );
                const ltThis = shift?.liftTimePlanDetails[i];
                const remark = ltThis?.Details?.[0]?.Remarks;
                return remark && remark.trim() !== ""
                    ? `${crane}: ${remark}`
                    : null;
                })
                .filter(Boolean)
                .join("\n") || "-";

            dataRow.push({
            v: remarks,
            s: {
                font: { sz: 8 },
                alignment: {
                horizontal: "left",
                vertical: "center",
                wrapText: true,
                },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });

            gangDetails.gangPlanDetails.forEach((plan) => {
            const shift = plan.shiftPlanDetails.find(
                (s) => s.ShiftNumber === shiftNo
            );
            let staffInfo = "";

            if (i === 0) {
                staffInfo = `FM: ${shift?.Foreman ?? "-"}`;
            } else if (i === 1) {
                staffInfo = `BP: ${shift?.BayPlanner ?? "-"}`;
            } else if (i === 2) {
                staffInfo = `WM01: ${shift?.Winchman ?? "-"}`;
            } else if (i === 3) {
                staffInfo = `WM02: ${shift?.Winchman2 ?? "-"}`;
            } else if (i === 4) {
                staffInfo = `WM03: ${shift?.Winchman3 ?? "-"}`;
            } else if (i === 5) {
                staffInfo = `RDT: ${shift?.Rdt ?? "-"}`;
            }

            dataRow.push({
                v: staffInfo,
                s: {
                font: { sz: 8 },
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                },
            });
            });
            wsData.push(dataRow);
        });
        });

        // Summary rows with styling (Total lifts left, Productivity Rate, Est Hrs of Completion)
        const summaryRows = [
        {
            label: "Total lifts left",
            bgColor: "8497B0",
            calculation: (plan) => {
            const totalLifts =
                Number(plan.details.Discharge) +
                Number(plan.details.Overstow) +
                Number(plan.details.Restow) +
                Number(plan.details.Loads);
            const totalActual = plan.shiftPlanDetails.reduce((sum, shift) => {
                const shiftSum = (shift.liftTimePlanDetails || []).reduce(
                (s, lt) => {
                    const details = lt?.Details?.[0];
                    return s + (Number(details?.Actual) || 0);
                },
                0
                );
                return sum + shiftSum;
            }, 0);
            return totalLifts - totalActual;
            },
        },
        {
            label: "Productivity Rate",
            bgColor: "8497B0",
            calculation: (plan) => {
            let totalActual = 0,
                totalCount = 0;
            plan.shiftPlanDetails.forEach((shift) => {
                (shift.liftTimePlanDetails || []).forEach((lt) => {
                const details = lt?.Details?.[0];
                if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                }
                });
            });
            return totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
            },
        },
        {
            label: "Est Hrs of Completion",
            bgColor: "8497B0",
            calculation: (plan) => {
            let totalActual = 0,
                totalCount = 0;
            const totalLifts =
                Number(plan.details.Discharge) +
                Number(plan.details.Overstow) +
                Number(plan.details.Restow) +
                Number(plan.details.Loads);
            plan.shiftPlanDetails.forEach((shift) => {
                (shift.liftTimePlanDetails || []).forEach((lt) => {
                const details = lt?.Details?.[0];
                if (details) {
                    totalActual += Number(details.Actual) || 0;
                    totalCount++;
                }
                });
            });
            const productivity =
                totalCount > 0 ? (totalActual / totalCount).toFixed(0) : 0;
            return productivity > 0
                ? ((totalLifts - totalActual) / productivity).toFixed(0)
                : 0;
            },
        },
        ];

        summaryRows.forEach((summaryRow) => {
        const row = [
            {
            v: summaryRow.label,
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: "8497B0" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            }
        ];

        gangDetails.gangPlanDetails.forEach((plan) => {
            row.push({
            v: summaryRow.calculation(plan),
            s: {
                font: { bold: true, sz: 10 },
                fill: { fgColor: { rgb: summaryRow.bgColor } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
                },
            },
            });
            row.push("", "");
        });

        wsData.push(row);
        for (let i = 0; i < numGangs; i++) {
            merges.push({
            s: { r: wsData.length - 1, c: 1 + i * 3 },
            e: { r: wsData.length - 1, c: 3 + i * 3 },
            });
        }
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!merges"] = merges;

        const colWidths = [{ wch: 20 }];
        for (let i = 0; i < numGangs * 3; i++) {
        colWidths.push({ wch: 12 });
        }
        colWidths.push({ wch: 30 });
        for (let i = 0; i < numGangs; i++) {
        colWidths.push({ wch: 25 });
        }
        ws["!cols"] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Gang Details");
        XLSX.writeFile(wb, `Voyage_${gangDetails.inwardVoyage}.xlsx`);
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    getAllVesselNames();
  }, []);

  const value = {
    voyageNames,
    vesselNames,
    gangDetails,
    gangDetailCars,
    getAllVoyageNames,
    getGangDetails,
    getGangDetailsCar,
    exportTableStyled,
    exportTableStyledCar
  };

  return (
    <PortContext.Provider value={value}>{props.children}</PortContext.Provider>
  );
};

export default PortContextProvider;
