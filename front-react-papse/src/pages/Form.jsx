import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createInscricao } from '../services/api';
import HeaderMenu from '../components/shared/HeaderMenu';
import styles from './Form.module.css';

const Form = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            // Validate phone and matricula are numbers
            if (!/^[0-9]+$/.test(data.telefone)) {
                alert('O campo Telefone deve conter apenas números.');
                return;
            }

            if (!/^[0-9]+$/.test(data.matricula)) {
                alert('O campo Matrícula deve conter apenas números.');
                return;
            }

            // Validate date is not in future
            const dataNascimento = new Date(data.dataNascimento);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            if (dataNascimento > hoje) {
                alert('Por favor, insira uma data de nascimento válida e que não seja no futuro.');
                return;
            }

            const inscricaoData = {
                nome: data.nome,
                matricula: data.matricula,
                data_nascimento: new Date(data.dataNascimento).toISOString(),
                data_inscricao: new Date().toISOString(),
                telefone: data.telefone,
                relato: data.motivo,
                curso: data.curso
            };

            await createInscricao(inscricaoData);
            alert('Inscrição realizada com sucesso!');
            reset();
        } catch (error) {
            console.error('Erro ao enviar inscrição:', error);
            alert('Ocorreu um erro ao enviar sua inscrição. Tente novamente.');
        }
    };

    return (
        <div className={styles.contentWrapper}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
                <HeaderMenu />
            </div>
            <div className={styles.formSection}>
                <div className={styles.formCard}>
                    <h1>Ficha de Inscrição</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Daniel Rodrigues Mendes"
                                {...register('nome', { required: 'Nome é obrigatório' })}
                            />
                            {errors.nome && <span className={styles.errorMessage}>{errors.nome.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="mendes@gmail.com"
                                {...register('email', {
                                    required: 'Email é obrigatório',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email inválido'
                                    }
                                })}
                            />
                            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="telefone">Telefone</label>
                            <input
                                type="tel"
                                id="telefone"
                                placeholder="Digite seu telefone"
                                {...register('telefone', { required: 'Telefone é obrigatório' })}
                            />
                            {errors.telefone && <span className={styles.errorMessage}>{errors.telefone.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="curso">Curso</label>
                            <select
                                id="curso"
                                {...register('curso', { required: 'Curso é obrigatório' })}
                                defaultValue=""
                            >
                                <option value="" disabled>Escolha seu curso</option>
                                <option value="psicologia">Psicologia</option>
                                <option value="si">Sistemas de Informação</option>
                                <option value="ec">Engenharia da Computação</option>
                            </select>
                            {errors.curso && <span className={styles.errorMessage}>{errors.curso.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="dataNascimento">Data Nascimento</label>
                            <input
                                type="date"
                                id="dataNascimento"
                                {...register('dataNascimento', { required: 'Data de nascimento é obrigatória' })}
                            />
                            {errors.dataNascimento && <span className={styles.errorMessage}>{errors.dataNascimento.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="matricula">Matrícula</label>
                            <input
                                type="text"
                                id="matricula"
                                placeholder="Digite sua matrícula"
                                {...register('matricula', { required: 'Matrícula é obrigatória' })}
                            />
                            {errors.matricula && <span className={styles.errorMessage}>{errors.matricula.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="motivo">
                                Deseja escrever o motivo do porque acha que precisa de acompanhamento psicológico?
                                <span className={styles.optional}> (Opcional)</span>
                            </label>
                            <textarea
                                id="motivo"
                                rows="5"
                                {...register('motivo')}
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn}>ENVIAR</button>
                    </form>
                </div>
            </div>

            <div className={styles.illustrationSection}>
                <img src="/assets/images/illustration-form.svg" alt="Ilustração de uma pessoa segurando máscaras de emoções" />
            </div>
        </div>
    );
};

export default Form;
