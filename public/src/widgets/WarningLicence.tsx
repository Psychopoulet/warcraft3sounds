// deps

    // externals
    import React from "react";
    import {
        Modal, ModalBody, ModalFooter,
        Icon,
        Button
    } from "react-bootstrap-fontawesome";

// types & interfaces

    // externals
    import type { iPropsNode } from "react-bootstrap-fontawesome";

// Props && States

    interface iProps extends iPropsNode {
        "onClose": (e: React.MouseEvent<HTMLButtonElement>) => void;
    }

// component

export default class Menu extends React.PureComponent<iProps> {

    // name

        public static displayName: string = "Menu";

    // render

    public render (): React.JSX.Element {

        return <Modal appId="Warcraft3SoundsApp" title="Licence">

            <ModalBody>

                <p>
                    Pour utiliser cette application, vous devez préalablement avoir acheté le jeu Warcraft 3.
                    Les sons et images sont la propriété de Blizzard Entertainment, et la vôtre à la condition d'avoir acheté le jeu.
                </p>

                <p>
                    <span className="text-warning text-decoration-underline fw-bold">Attention !</span>
                    <br /><br />
                    <Icon variant="danger" type="times" /> <span className="text-decoration-underline">Il n'est pas ici question de la version Reforged</span>, qui n'est qu'une forme de location, un achat non du jeu mais d'une licence d'utilisation.<br />
                    <Icon variant="success" type="check" /> <span className="text-decoration-underline">Il n'est question que du jeu physique original warcraft 3 Reign of Chaos et de son extension The Frozen Throne</span>.
                    <br /><br />
                    (Notez que de toute façon, les sons sont ceux du jeu original, et non des versions Reforged.)
                </p>

                <p>
                    Vous ne trouverez ici ni cookies, ni publicité, ni aucune forme de traçage.
                    <br /><br />
                    - <span className="text-decoration-underline fw-semibold">Cette application n'est donc pas monétisée, d'aucune façon</span><br />
                    - N'étant pas traqué, cette fenêtre sera affichée à chaque fois que vous ouvrirez l'application.
                </p>

            </ModalBody>

            <ModalFooter>

                <Button variant="success" block
                    onClick={ this.props.onClose }
                >
                    J'ai acheté le jeu
                </Button>

            </ModalFooter>

        </Modal>;

    }

}
