import PatientList from './PatientList';

const Report = () => {
    return (
        <PatientList
            status="encerrado"
            title="Relatório de Inscrições Encerradas"
            nextStatus={null}
            canEncerrar={false}
        />
    );
};

export default Report;
