import React from "react";
import { Pagination } from "@material-ui/lab";

import "./Pagination.css";

export default function Paging(props) {
  return (
    <div className="contain-paging">
      <Pagination
        count={props.count}
        onChange={props.onChange}
        variant="text"
        shape="rounded"
        color="standard"
      />
    </div>
  );
}
