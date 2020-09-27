import { h } from 'preact';

import c295j from '../../../assets/constitution-295.jpg';
import c295w from '../../../assets/constitution-295.webp';
import c632j from '../../../assets/constitution-632.jpg';
import c632w from '../../../assets/constitution-632.webp';
import c875j from '../../../assets/constitution-875.jpg';
import c875w from '../../../assets/constitution-875.webp';
import c922j from '../../../assets/constitution-922.jpg';
import c922w from '../../../assets/constitution-922.webp';
import '../static.scss';

export default function Grounds(): h.JSX.Element {
    return (
        <section className="static grounds block block--centered">
            <header className="block__header">Підстави діяльності Центру «Миротворець»</header>

            <picture>
                <source
                    srcSet={`
                        ${c295w} 295w,
                        ${c632w} 632w,
                        ${c875w} 875w,
                        ${c922w} 922w`}
                    sizes="
                        (max-width: 414px) 295px,
                        (max-width: 768px) 632px,
                        (max-width: 1024px) 875px,
                        922px
                        "
                    type="image/webp"
                />
                <source
                    srcSet={`
                        ${c295j} 295w,
                        ${c632j} 632w,
                        ${c875j} 875w,
                        ${c922j} 922w`}
                    sizes="
                        (max-width: 414px) 295px,
                        (max-width: 768px) 632px,
                        (max-width: 1024px) 875px,
                        922px
                        "
                    type="image/jpeg"
                />
                <img src={c295j as string} alt="" />
            </picture>

            <section>
                <h2>КОНСТИТУЦІЯ УКРАЇНИ</h2>

                <article>
                    <h3>
                        Стаття 17. Захист суверенітету і територіальної цілісності України, забезпечення її економічної
                        та інформаційної безпеки є найважливішими функціями держави, справою всього Українського народу.
                    </h3>
                    <ul>
                        <li>
                            Оборона України, захист її суверенітету, територіальної цілісності і недоторканності
                            покладаються на Збройні Сили України.
                        </li>
                        <li>
                            Забезпечення державної безпеки і захист державного кордону України покладаються на
                            відповідні військові формування та правоохоронні органи держави, організація і порядок
                            діяльності яких визначаються законом.
                        </li>
                        <li>
                            Збройні Сили України та інші військові формування ніким не можуть бути використані для
                            обмеження прав і свобод громадян або з метою повалення конституційного ладу, усунення
                            органів влади чи перешкоджання їх діяльності.
                        </li>
                        <li>
                            Держава забезпечує соціальний захист громадян України, які перебувають на службі у Збройних
                            Силах України та в інших військових формуваннях, а також членів їхніх сімей.
                        </li>
                        <li>
                            На території України забороняється створення і функціонування будь-яких збройних формувань,
                            не передбачених законом.
                        </li>
                        <li>На території України не допускається розташування іноземних військових баз.</li>
                    </ul>
                </article>

                <article>
                    <h3>
                        Стаття 65. Захист Вітчизни, незалежності та територіальної цілісності України, шанування її
                        державних символів є обовʼязком громадян України.
                    </h3>
                    <ul>
                        <li>Громадяни відбувають військову службу відповідно до закону.</li>
                    </ul>
                </article>
            </section>

            <section>
                <h2>Закон України «Про інформацію»</h2>

                <article>
                    <h3>Стаття 5. Право на інформацію</h3>
                    <ol>
                        <li>
                            Кожен має право на інформацію, що передбачає можливість вільного одержання, використання,
                            поширення, зберігання та захисту інформації, необхідної для реалізації своїх прав, свобод і
                            законних інтересів. Реалізація права на інформацію не повинна порушувати громадські,
                            політичні, економічні, соціальні, духовні, екологічні та інші права, свободи і законні
                            інтереси інших громадян, права та інтереси юридичних осіб.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 11. Інформація про фізичну особу</h3>
                    <ol>
                        <li>
                            Інформація про фізичну особу — відомості чи сукупність відомостей про фізичну особу, яка
                            ідентифікована або може бути конкретно ідентифікована.
                        </li>
                        <li>
                            Не допускаються збирання, зберігання, використання та поширення конфіденційної інформації
                            про особу без її згоди, крім випадків, визначених законом, і лише в інтересах національної
                            безпеки, економічного добробуту та захисту прав людини. До конфіденційної інформації про
                            фізичну особу належать, зокрема, дані про її національність, освіту, сімейний стан,
                            релігійні переконання, стан здоровʼя, а також адреса, дата і місце народження. Кожному
                            забезпечується вільний доступ до інформації, яка стосується його особисто, крім випадків,
                            передбачених законом.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 20. Доступ до інформації</h3>
                    <ol>
                        <li>
                            За порядком доступу інформація поділяється на відкриту інформацію та інформацію з обмеженим
                            доступом.
                        </li>
                        <li>
                            Будь-яка інформація є відкритою, крім тієї, що віднесена законом до інформації з обмеженим
                            доступом.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 21. Інформація з обмеженим доступом</h3>
                    <ol>
                        <li>Інформацією з обмеженим доступом є конфіденційна, таємна та службова інформація.</li>
                        <li>
                            Конфіденційною є інформація про фізичну особу, а також інформація, доступ до якої обмежено
                            фізичною або юридичною особою, крім субʼєктів владних повноважень. Конфіденційна інформація
                            може поширюватися за бажанням відповідної особи у визначеному нею порядку відповідно до
                            передбачених нею умов, а також в інших випадках, визначених законом. Відносини, повʼязані з
                            правовим режимом конфіденційної інформації, регулюються законом.
                        </li>
                        <li>
                            Порядок віднесення інформації до таємної або службової, а також порядок доступу до неї
                            регулюються законами.
                        </li>
                        <li>
                            До інформації з обмеженим доступом не можуть бути віднесені такі відомості:
                            <ol>
                                <li>про стан довкілля, якість харчових продуктів і предметів побуту;</li>
                                <li>
                                    про аварії, катастрофи, небезпечні природні явища та інші надзвичайні ситуації, що
                                    сталися або можуть статися і загрожують безпеці людей;
                                </li>
                                <li>
                                    про стан здоровʼя населення, його життєвий рівень, включаючи харчування, одяг,
                                    житло, медичне обслуговування та соціальне забезпечення, а також про
                                    соціально-демографічні показники, стан правопорядку, освіти і культури населення;
                                </li>
                                <li>про факти порушення прав і свобод людини і громадянина;</li>
                                <li>
                                    про незаконні дії органів державної влади, органів місцевого самоврядування, їх
                                    посадових та службових осіб;
                                </li>
                                <li>
                                    інші відомості, доступ до яких не може бути обмежено відповідно до законів та
                                    міжнародних договорів України, згода на обовʼязковість яких надана Верховною Радою
                                    України.
                                </li>
                            </ol>
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 28. Неприпустимість зловживання правом на інформацію</h3>
                    <ol>
                        <li>
                            Інформація не може бути використана для закликів до повалення конституційного ладу,
                            порушення територіальної цілісності України, пропаганди війни, насильства, жорстокості,
                            розпалювання міжетнічної, расової, релігійної ворожнечі, вчинення терористичних актів,
                            посягання на права і свободи людини.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 29. Поширення суспільно необхідної інформації</h3>
                    <ol>
                        <li>
                            Інформація з обмеженим доступом може бути поширена, якщо вона є суспільно необхідною, тобто
                            є предметом суспільного інтересу, і право громадськості знати цю інформацію переважає
                            потенційну шкоду від її поширення.
                        </li>
                        <li>
                            Предметом суспільного інтересу вважається інформація, яка свідчить про загрозу державному
                            суверенітету, територіальній цілісності України; забезпечує реалізацію конституційних прав,
                            свобод і обовʼязків; свідчить про можливість порушення прав людини, введення громадськості в
                            оману, шкідливі екологічні та інші негативні наслідки діяльності фізичних або юридичних осіб
                            тощо.
                        </li>
                    </ol>
                </article>
            </section>

            <section>
                <h2>Закон України «Про боротьбу з тероризмом»</h2>
                <article>
                    <h3>Стаття 3. Основні принципи боротьби з тероризмом</h3>
                    <ul>
                        <li>
                            Боротьба з тероризмом ґрунтується на принципах: законності та неухильного додержання прав і
                            свобод людини і громадянина;
                        </li>
                        <li>
                            комплексного використання з цією метою правових, політичних, соціально-економічних,
                            інформаційно-пропагандистських та інших можливостей; пріоритетності попереджувальних
                            заходів;
                        </li>
                        <li>невідворотності покарання за участь у терористичній діяльності;</li>
                        <li>
                            пріоритетності захисту життя і прав осіб, які наражаються на небезпеку внаслідок
                            терористичної діяльності;
                        </li>
                        <li>поєднання гласних і негласних методів боротьби з тероризмом;</li>
                        <li>
                            нерозголошення відомостей про технічні прийоми і тактику проведення антитерористичних
                            операцій, а також про склад їх учасників;
                        </li>
                        <li>
                            єдиноначальності в керівництві силами і засобами, що залучаються для проведення
                            антитерористичних операцій;
                        </li>
                        <li>
                            співробітництва у сфері боротьби з тероризмом з іноземними державами, їх правоохоронними
                            органами і спеціальними службами, а також з міжнародними організаціями, які здійснюють
                            боротьбу з тероризмом.
                        </li>
                    </ul>
                </article>

                <article>
                    <h3>Стаття 6. Повноваження інших субʼєктів, які залучаються до боротьби з тероризмом</h3>
                    <ul>
                        <li>
                            Субʼєкти, які залучаються до боротьби з тероризмом, у межах своєї компетенції здійснюють
                            заходи щодо запобігання, виявлення і припинення терористичних актів та злочинів
                            терористичної спрямованості; розробляють і реалізують попереджувальні, режимні,
                            організаційні, виховні та інші заходи;
                        </li>
                        <li>
                            забезпечують умови проведення антитерористичних операцій на обʼєктах, що належать до сфери
                            їх управління; надають відповідним підрозділам під час проведення таких операцій
                            матеріально-технічні та фінансові засоби, засоби транспорту і звʼязку, медичне обладнання і
                            медикаменти, інші засоби, а також інформацію, необхідну для виконання завдань щодо боротьби
                            з тероризмом.
                        </li>
                    </ul>
                </article>
            </section>

            <section>
                <h2>Закон України «Про захист персональних даних»</h2>

                <article>
                    <h3>Стаття 2. Визначення термінів</h3>
                    &lt;…&gt;
                    <ul>
                        <li>
                            <dfn>згода суб’єкта персональних даних</dfn> — будь-яке документоване, зокрема письмове,
                            добровільне волевиявлення фізичної особи щодо надання дозволу на обробку її персональних
                            даних відповідно до сформульованої мети їх обробки;
                        </li>
                        <li>
                            <dfn>знеособлення персональних даних</dfn> — вилучення відомостей, які дають змогу
                            ідентифікувати особу;
                        </li>
                        <li>
                            <dfn>обробка персональних даних</dfn> — будь-яка дія або сукупність дій, здійснених повністю
                            або частково в інформаційній (автоматизованій) системі та/або в картотеках персональних
                            даних, які пов’язані зі збиранням, реєстрацією, накопиченням, зберіганням, адаптуванням,
                            зміною, поновленням, використанням і поширенням (розповсюдженням, реалізацією, передачею),
                            знеособленням, знищенням відомостей про фізичну особу;
                        </li>
                        <li>
                            <dfn>персональні дані</dfn> — відомості чи сукупність відомостей про фізичну особу, яка
                            ідентифікована або може бути конкретно ідентифікована;
                        </li>
                    </ul>
                </article>

                <article>
                    <h3>Стаття 6. Загальні вимоги до обробки персональних даних</h3>
                    <ol start={6}>
                        <li>
                            Не допускається обробка даних про фізичну особу без її згоди, крім випадків, визначених
                            законом, і лише в інтересах національної безпеки, економічного добробуту та прав людини.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 7. Особливі вимоги до обробки персональних даних</h3>
                    <ol>
                        <li>
                            Забороняється обробка персональних даних про расове або етнічне походження, політичні,
                            релігійні або світоглядні переконання, членство в політичних партіях та професійних спілках,
                            а також даних, що стосуються здоров’я чи статевого життя.
                        </li>
                    </ol>
                    Положення частини першої цієї статті не застосовується, якщо обробка персональних даних:
                    <ol>
                        <li>
                            здійснюється за умови надання суб’єктом персональних даних однозначної згоди на обробку
                            таких даних;
                        </li>
                    </ol>
                    &lt;…&gt;
                    <ol start={7}>
                        <li>
                            стосується обвинувачень у вчиненні злочинів, вироків суду, здійснення державним органом
                            повноважень, визначених законом, щодо виконання завдань оперативно-розшукової чи
                            контррозвідувальної діяльності, боротьби з тероризмом;
                        </li>
                        <li>стосується даних, які були оприлюднені суб’єктом персональних даних.</li>
                    </ol>
                </article>
            </section>

            <section>
                <h2>КРИМІНАЛЬНИЙ КОДЕКС УКРАЇНИ</h2>

                <article>
                    <h3>Стаття 396. Приховування злочину</h3>
                    <ol>
                        <li>
                            Заздалегідь не обіцяне приховування тяжкого чи особливо тяжкого злочину - карається арештом
                            на строк до трьох місяців або обмеженням волі на строк до трьох років, або позбавленням волі
                            на той самий строк.
                        </li>
                        <li>
                            Не підлягають кримінальній відповідальності за заздалегідь не обіцяне приховування злочину
                            члени сімʼї чи близькі родичі особи, яка вчинила злочин, коло яких визначається законом.
                        </li>
                    </ol>
                </article>
            </section>

            <section>
                <h2>Конвенція про захист осіб у звʼязку з автоматизованою обробкою персональних даних</h2>

                <article>
                    <h3>Стаття 5. Качество данных</h3>

                    <p>Персональні дані, що піддаються автоматизованій обробці, повинні:</p>
                    <ol type="a">
                        <li>отримуватися та оброблятися сумлінно та законно;</li>
                        <li>
                            зберігатися для визначених і законних цілей та не використовуватися в спосіб, не сумісний із
                            цими цілями;
                        </li>
                        <li>
                            бути адекватними, відповідними та ненадмірними стосовно цілей, для яких вони зберігаються;
                        </li>
                        <li>бути точними та в разі необхідності оновлюватися;</li>
                        <li>
                            зберігатись у формі, яка дозволяє ідентифікацію субʼєктів даних не довше, ніж це необхідно
                            для мети, для якої такі дані зберігаються.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 6. Особливі категорії даних</h3>
                    <p>
                        Персональні дані, що свідчать про расову приналежність, політичні, релігійні чи інші
                        переконання, а також дані, що стосуються здоровʼя або статевого життя, не можуть піддаватися
                        автоматизованій обробці, якщо внутрішнє законодавство не забезпечує відповідних гарантій. Це
                        правило також застосовується до персональних даних, що стосуються засудження в кримінальному
                        порядку.
                    </p>
                </article>

                <article>
                    <h3>Стаття 8. Додаткові гарантії для субʼєкта даних</h3>
                    <p>Будь-якій особі надається можливість:</p>
                    <ol type="a">
                        <li>
                            зʼясувати існування файлу персональних даних для автоматизованої обробки, його головні цілі,
                            а також особу та постійне місце проживання чи головне місце роботи контролера файлу;
                        </li>
                        <li>
                            отримувати через обґрунтовані періоди та без надмірної затримки або витрат підтвердження або
                            спростування факту зберігання персональних даних, що її стосуються, у файлі даних для
                            автоматизованої обробки, а також отримувати такі дані в доступній для розуміння формі;
                        </li>
                        <li>
                            вимагати у відповідних випадках виправлення або знищення таких даних, якщо вони оброблялися
                            всупереч положенням внутрішнього законодавства, що запроваджують основоположні принципи,
                            визначені у статтях 5 і 6 цієї Конвенції;
                        </li>
                        <li>
                            використовувати засоби правового захисту в разі невиконання передбаченого в пунктах "b" і
                            "c" цієї статті прохання про підтвердження або у відповідних випадках про надання,
                            виправлення або знищення персональних даних.
                        </li>
                    </ol>
                </article>

                <article>
                    <h3>Стаття 9. Винятки та обмеження</h3>
                    <ol>
                        <li>
                            Винятки з положень статей 5, 6 та 8 цієї Конвенції дозволяються лише в рамках, визначених
                            цією статтею.
                        </li>
                        <li>
                            Відхилення від положень статей 5, 6 та 8 цієї Конвенції дозволяється тоді, коли таке
                            відхилення передбачене законодавством Сторони та є в демократичному суспільстві необхідним
                            заходом, спрямованим на:
                            <ol type="a">
                                <li>
                                    захист державної та громадської безпеки, фінансових інтересів Держави або на
                                    боротьбу з кримінальними правопорушеннями;
                                </li>
                                <li>захист субʼєкта даних або прав і свобод інших людей.</li>
                            </ol>
                        </li>
                        <li>
                            Обмеження стосовно здійснення прав, визначених у пунктах "b", "c" та "d" статті 8, можуть
                            установлюватися законодавством стосовно файлів персональних даних для автоматизованої
                            обробки, що використовуються для цілей статистики або наукових досліджень у випадках явної
                            відсутності небезпеки порушення недоторканості приватного життя субʼєктів даних.
                        </li>
                    </ol>
                </article>
            </section>
        </section>
    );
}
