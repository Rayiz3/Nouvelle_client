import React from "react";
import EditColor from "../components/edit/EditColor";
import EditStack from "../components/edit/EditStack";
import EditLink from "../components/edit/EditLink";
import EditIconMeshUrl from "../components/edit/EditIconMesh";

const EditBody: React.FC = () => {
    return (
        <div className="flex flex-1 flex-col items-start justify-start gap-12 mt-8 mb-8 font-pretendard overflow-auto scrollbar-hide">
            <EditColor />
            <EditStack />
            <EditLink />
            <EditIconMeshUrl />
        </div>
    )
}

export default EditBody