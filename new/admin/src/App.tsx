import { useEffect, useMemo, useState } from "react";
import { checkAuth, fetchContent, login, logout, saveContent, uploadImage } from "./api";
import type { CarouselImage, Content, PriceRow, Project, Service } from "./types";

const SECTIONS = [
  { id: "site", label: "Site settings" },
  { id: "projects", label: "Projects" },
  { id: "carousels", label: "Carousels" },
  { id: "services", label: "Services" },
  { id: "pricing", label: "Pricing" },
  { id: "contacts", label: "Contacts" }
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const emptyNotice = { type: "", message: "" } as { type: "success" | "error" | ""; message: string };

function nextId(current: number[]): number {
  return current.length ? Math.max(...current) + 1 : 1;
}

function reorderWithKey<T extends Record<string, any>>(items: T[], key: keyof T): T[] {
  return items.map((item, index) => ({ ...item, [key]: index + 1 }));
}

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("site");
  const [content, setContent] = useState<Content | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(emptyNotice);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await checkAuth();
        setIsAuth(true);
        const data = await fetchContent();
        setContent(data);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const sortedProjects = useMemo(() => {
    if (!content) return [] as Project[];
    return [...content.projects].sort((a, b) => a.sort - b.sort);
  }, [content]);

  const sortedServices = useMemo(() => {
    if (!content) return [] as Service[];
    return [...content.services].sort((a, b) => a.order - b.order);
  }, [content]);

  const handleLogin = async () => {
    setNotice(emptyNotice);
    try {
      await login(password);
      const data = await fetchContent();
      setContent(data);
      setIsAuth(true);
      setPassword("");
    } catch (error: any) {
      setNotice({ type: "error", message: error.message || "Ошибка входа" });
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuth(false);
    setContent(null);
  };

  const handleSave = async () => {
    if (!content) return;
    setNotice(emptyNotice);
    try {
      await saveContent(content);
      setNotice({ type: "success", message: "Сохранено" });
    } catch (error: any) {
      setNotice({ type: "error", message: error.message || "Ошибка сохранения" });
    }
  };

  const handleUpload = async (file: File, onChange: (url: string) => void) => {
    setNotice(emptyNotice);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
      setNotice({ type: "success", message: "Изображение загружено" });
    } catch (error: any) {
      setNotice({ type: "error", message: error.message || "Ошибка загрузки" });
    }
  };

  if (loading) {
    return <div className="login">Загрузка...</div>;
  }

  if (!isAuth) {
    return (
      <div className="login">
        <h2>Вход в админ-панель</h2>
        {notice.message && <div className={`notice ${notice.type}`}>{notice.message}</div>}
        <div className="field">
          <label>Пароль</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button className="primary" onClick={handleLogin}>
          Войти
        </button>
      </div>
    );
  }

  if (!content) {
    return <div className="login">Нет данных</div>;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Админ-панель</h1>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
        <button className="nav-button" onClick={handleLogout}>
          Выйти
        </button>
      </aside>

      <main className="content">
        <div className="section-header">
          <h2 className="section-title">{SECTIONS.find((item) => item.id === activeSection)?.label}</h2>
          <button className="primary" onClick={handleSave}>
            Сохранить изменения
          </button>
        </div>
        {notice.message && <div className={`notice ${notice.type}`}>{notice.message}</div>}

        {activeSection === "site" && (
          <div className="card">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                value={content.site.title}
                onChange={(event) => setContent({ ...content, site: { ...content.site, title: event.target.value } })}
              />
            </div>
            <div className="field">
              <label>Meta description</label>
              <textarea
                value={content.site.description}
                onChange={(event) =>
                  setContent({ ...content, site: { ...content.site, description: event.target.value } })
                }
              />
            </div>
            <div className="field">
              <label>Meta keywords</label>
              <textarea
                value={content.site.keywords}
                onChange={(event) => setContent({ ...content, site: { ...content.site, keywords: event.target.value } })}
              />
            </div>
            <div className="field">
              <label>Canonical</label>
              <input
                type="text"
                value={content.site.canonical}
                onChange={(event) => setContent({ ...content, site: { ...content.site, canonical: event.target.value } })}
              />
            </div>
            <div className="row two">
              <div className="field">
                <label>Hero строка 1</label>
                <input
                  type="text"
                  value={content.site.heroTitleLines[0] || ""}
                  onChange={(event) => {
                    const nextLines = [...content.site.heroTitleLines];
                    nextLines[0] = event.target.value;
                    setContent({ ...content, site: { ...content.site, heroTitleLines: nextLines } });
                  }}
                />
              </div>
              <div className="field">
                <label>Hero строка 2</label>
                <input
                  type="text"
                  value={content.site.heroTitleLines[1] || ""}
                  onChange={(event) => {
                    const nextLines = [...content.site.heroTitleLines];
                    nextLines[1] = event.target.value;
                    setContent({ ...content, site: { ...content.site, heroTitleLines: nextLines } });
                  }}
                />
              </div>
            </div>
            <div className="row two">
              <div className="field">
                <label>Заголовок проектов</label>
                <input
                  type="text"
                  value={content.site.sections.projectsTitle}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      site: { ...content.site, sections: { ...content.site.sections, projectsTitle: event.target.value } }
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Заголовок услуг</label>
                <input
                  type="text"
                  value={content.site.sections.servicesTitle}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      site: { ...content.site, sections: { ...content.site.sections, servicesTitle: event.target.value } }
                    })
                  }
                />
              </div>
            </div>
            <div className="row two">
              <div className="field">
                <label>Заголовок прайса</label>
                <input
                  type="text"
                  value={content.site.sections.pricingTitle}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      site: { ...content.site, sections: { ...content.site.sections, pricingTitle: event.target.value } }
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Заголовок контактов</label>
                <input
                  type="text"
                  value={content.site.sections.contactsTitle}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      site: { ...content.site, sections: { ...content.site.sections, contactsTitle: event.target.value } }
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label>Footer текст</label>
              <textarea
                value={content.site.footerText}
                onChange={(event) => setContent({ ...content, site: { ...content.site, footerText: event.target.value } })}
              />
            </div>
          </div>
        )}
        {activeSection === "projects" && (
          <div className="list">
            {sortedProjects.map((project, index) => (
              <div className="card" key={project.id}>
                <div className="item-header">
                  <div className="item-title">{project.title || `Проект ${project.id}`}</div>
                  <div className="inline-actions">
                    <button
                      className="secondary"
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...sortedProjects];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                      }}
                    >
                      Вверх
                    </button>
                    <button
                      className="secondary"
                      onClick={() => {
                        if (index === sortedProjects.length - 1) return;
                        const next = [...sortedProjects];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                      }}
                    >
                      Вниз
                    </button>
                    <button
                      className="danger"
                      onClick={() => {
                        const next = sortedProjects.filter((item) => item.id !== project.id);
                        setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label>Название</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(event) => {
                      const next = sortedProjects.map((item) =>
                        item.id === project.id ? { ...item, title: event.target.value } : item
                      );
                      setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                    }}
                  />
                </div>
                <div className="field">
                  <label>Описание</label>
                  <textarea
                    value={project.description}
                    onChange={(event) => {
                      const next = sortedProjects.map((item) =>
                        item.id === project.id ? { ...item, description: event.target.value } : item
                      );
                      setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                    }}
                  />
                </div>
                <div className="row two">
                  <div className="field">
                    <label>Small image</label>
                    <input
                      type="text"
                      value={project.smallImage}
                      onChange={(event) => {
                        const next = sortedProjects.map((item) =>
                          item.id === project.id ? { ...item, smallImage: event.target.value } : item
                        );
                        setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        handleUpload(file, (url) => {
                          const next = sortedProjects.map((item) =>
                            item.id === project.id ? { ...item, smallImage: url } : item
                          );
                          setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                        });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Featured image 1</label>
                    <input
                      type="text"
                      value={project.featuredImages[0]}
                      onChange={(event) => {
                        const next = sortedProjects.map((item) =>
                          item.id === project.id
                            ? { ...item, featuredImages: [event.target.value, item.featuredImages[1]] }
                            : item
                        );
                        setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        handleUpload(file, (url) => {
                          const next = sortedProjects.map((item) =>
                            item.id === project.id ? { ...item, featuredImages: [url, item.featuredImages[1]] } : item
                          );
                          setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="row two">
                  <div className="field">
                    <label>Featured image 2</label>
                    <input
                      type="text"
                      value={project.featuredImages[1]}
                      onChange={(event) => {
                        const next = sortedProjects.map((item) =>
                          item.id === project.id
                            ? { ...item, featuredImages: [item.featuredImages[0], event.target.value] }
                            : item
                        );
                        setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        handleUpload(file, (url) => {
                          const next = sortedProjects.map((item) =>
                            item.id === project.id ? { ...item, featuredImages: [item.featuredImages[0], url] } : item
                          );
                          setContent({ ...content, projects: reorderWithKey(next, "sort") as Project[] });
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              className="secondary"
              onClick={() => {
                const newProject: Project = {
                  id: nextId(sortedProjects.map((item) => item.id)),
                  title: "Новый проект",
                  description: "Описание проекта",
                  smallImage: "",
                  featuredImages: ["", ""],
                  sort: sortedProjects.length + 1
                };
                setContent({ ...content, projects: [...sortedProjects, newProject] });
              }}
            >
              Добавить проект
            </button>
          </div>
        )}

        {activeSection === "services" && (
          <div className="list">
            {sortedServices.map((service, index) => (
              <div className="card" key={service.id}>
                <div className="item-header">
                  <div className="item-title">{service.title}</div>
                  <div className="inline-actions">
                    <button
                      className="secondary"
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...sortedServices];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                      }}
                    >
                      Вверх
                    </button>
                    <button
                      className="secondary"
                      onClick={() => {
                        if (index === sortedServices.length - 1) return;
                        const next = [...sortedServices];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                      }}
                    >
                      Вниз
                    </button>
                    <button
                      className="danger"
                      onClick={() => {
                        const next = sortedServices.filter((item) => item.id !== service.id);
                        setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label>Название</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(event) => {
                      const next = sortedServices.map((item) =>
                        item.id === service.id ? { ...item, title: event.target.value } : item
                      );
                      setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                    }}
                  />
                </div>
                <div className="field">
                  <label>Описание</label>
                  <textarea
                    value={service.description}
                    onChange={(event) => {
                      const next = sortedServices.map((item) =>
                        item.id === service.id ? { ...item, description: event.target.value } : item
                      );
                      setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                    }}
                  />
                </div>
                <div className="field">
                  <label>Изображение</label>
                  <input
                    type="text"
                    value={service.image}
                    onChange={(event) => {
                      const next = sortedServices.map((item) =>
                        item.id === service.id ? { ...item, image: event.target.value } : item
                      );
                      setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      handleUpload(file, (url) => {
                        const next = sortedServices.map((item) =>
                          item.id === service.id ? { ...item, image: url } : item
                        );
                        setContent({ ...content, services: reorderWithKey(next, "order") as Service[] });
                      });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              className="secondary"
              onClick={() => {
                const newService: Service = {
                  id: nextId(sortedServices.map((item) => item.id)),
                  title: "Новая услуга",
                  description: "Описание услуги",
                  image: "",
                  order: sortedServices.length + 1
                };
                setContent({ ...content, services: [...sortedServices, newService] });
              }}
            >
              Добавить услугу
            </button>
          </div>
        )}
        {activeSection === "carousels" && (
          <div className="list">
            {content.carousels.map((carousel, carouselIndex) => (
              <div className="card" key={carousel.id}>
                <div className="field">
                  <label>Заголовок карусели #{carousel.id}</label>
                  <input
                    type="text"
                    value={carousel.title}
                    onChange={(event) => {
                      const next = [...content.carousels];
                      next[carouselIndex] = { ...carousel, title: event.target.value };
                      setContent({ ...content, carousels: next });
                    }}
                  />
                </div>
                <div className="list">
                  {[...carousel.images].sort((a, b) => a.order - b.order).map((image, index) => (
                    <div className="card" key={`${carousel.id}-${index}`}>
                      <div className="item-header">
                        <div className="item-title">Изображение {index + 1}</div>
                        <div className="inline-actions">
                          <button
                            className="secondary"
                            onClick={() => {
                              if (index === 0) return;
                              const orderSorted = [...carousel.images].sort((a, b) => a.order - b.order);
                              [orderSorted[index - 1], orderSorted[index]] = [orderSorted[index], orderSorted[index - 1]];
                              const reindexed = reorderWithKey(orderSorted, "order") as CarouselImage[];
                              const next = [...content.carousels];
                              next[carouselIndex] = { ...carousel, images: reindexed };
                              setContent({ ...content, carousels: next });
                            }}
                          >
                            Вверх
                          </button>
                          <button
                            className="secondary"
                            onClick={() => {
                              const orderSorted = [...carousel.images].sort((a, b) => a.order - b.order);
                              if (index === orderSorted.length - 1) return;
                              [orderSorted[index + 1], orderSorted[index]] = [orderSorted[index], orderSorted[index + 1]];
                              const reindexed = reorderWithKey(orderSorted, "order") as CarouselImage[];
                              const next = [...content.carousels];
                              next[carouselIndex] = { ...carousel, images: reindexed };
                              setContent({ ...content, carousels: next });
                            }}
                          >
                            Вниз
                          </button>
                          <button
                            className="danger"
                            onClick={() => {
                              const nextImages = carousel.images.filter((_, idx) => idx !== index);
                              const reindexed = reorderWithKey(nextImages, "order") as CarouselImage[];
                              const next = [...content.carousels];
                              next[carouselIndex] = { ...carousel, images: reindexed };
                              setContent({ ...content, carousels: next });
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                      <div className="row two">
                        <div className="field">
                          <label>Src</label>
                          <input
                            type="text"
                            value={image.src}
                            onChange={(event) => {
                              const orderSorted = [...carousel.images].sort((a, b) => a.order - b.order);
                              orderSorted[index] = { ...image, src: event.target.value };
                              const next = [...content.carousels];
                              next[carouselIndex] = { ...carousel, images: orderSorted };
                              setContent({ ...content, carousels: next });
                            }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              handleUpload(file, (url) => {
                                const orderSorted = [...carousel.images].sort((a, b) => a.order - b.order);
                                orderSorted[index] = { ...image, src: url };
                                const next = [...content.carousels];
                                next[carouselIndex] = { ...carousel, images: orderSorted };
                                setContent({ ...content, carousels: next });
                              });
                            }}
                          />
                        </div>
                        <div className="field">
                          <label>Alt</label>
                          <input
                            type="text"
                            value={image.alt || ""}
                            onChange={(event) => {
                              const orderSorted = [...carousel.images].sort((a, b) => a.order - b.order);
                              orderSorted[index] = { ...image, alt: event.target.value };
                              const next = [...content.carousels];
                              next[carouselIndex] = { ...carousel, images: orderSorted };
                              setContent({ ...content, carousels: next });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="secondary"
                  onClick={() => {
                    const nextImage: CarouselImage = {
                      src: "",
                      alt: "",
                      order: carousel.images.length + 1
                    };
                    const next = [...content.carousels];
                    next[carouselIndex] = { ...carousel, images: [...carousel.images, nextImage] };
                    setContent({ ...content, carousels: next });
                  }}
                >
                  Добавить изображение
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "pricing" && (
          <div className="list">
            <div className="card">
              <div className="field">
                <label>Примечание</label>
                <input
                  type="text"
                  value={content.pricing.note}
                  onChange={(event) => setContent({ ...content, pricing: { ...content.pricing, note: event.target.value } })}
                />
              </div>
            </div>

            {(["landscape", "interior"] as const).map((key) => {
              const table = content.pricing[key];
              const rowsSorted = [...table.rows].sort((a, b) => a.order - b.order);

              return (
                <div className="card" key={key}>
                  <div className="field">
                    <label>Заголовок ({key})</label>
                    <input
                      type="text"
                      value={table.title}
                      onChange={(event) => {
                        setContent({
                          ...content,
                          pricing: {
                            ...content.pricing,
                            [key]: { ...table, title: event.target.value }
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Мобильный заголовок ({key})</label>
                    <input
                      type="text"
                      value={table.mobileTitle}
                      onChange={(event) => {
                        setContent({
                          ...content,
                          pricing: {
                            ...content.pricing,
                            [key]: { ...table, mobileTitle: event.target.value }
                          }
                        });
                      }}
                    />
                  </div>

                  {rowsSorted.map((row, index) => (
                    <div className="card" key={row.id}>
                      <div className="item-header">
                        <div className="item-title">{row.name}</div>
                        <div className="inline-actions">
                          <button
                            className="secondary"
                            onClick={() => {
                              if (index === 0) return;
                              const nextRows = [...rowsSorted];
                              [nextRows[index - 1], nextRows[index]] = [nextRows[index], nextRows[index - 1]];
                              const reindexed = reorderWithKey(nextRows, "order") as PriceRow[];
                              setContent({
                                ...content,
                                pricing: { ...content.pricing, [key]: { ...table, rows: reindexed } }
                              });
                            }}
                          >
                            Вверх
                          </button>
                          <button
                            className="secondary"
                            onClick={() => {
                              if (index === rowsSorted.length - 1) return;
                              const nextRows = [...rowsSorted];
                              [nextRows[index + 1], nextRows[index]] = [nextRows[index], nextRows[index + 1]];
                              const reindexed = reorderWithKey(nextRows, "order") as PriceRow[];
                              setContent({
                                ...content,
                                pricing: { ...content.pricing, [key]: { ...table, rows: reindexed } }
                              });
                            }}
                          >
                            Вниз
                          </button>
                          <button
                            className="danger"
                            onClick={() => {
                              const nextRows = rowsSorted.filter((item) => item.id !== row.id);
                              const reindexed = reorderWithKey(nextRows, "order") as PriceRow[];
                              setContent({
                                ...content,
                                pricing: { ...content.pricing, [key]: { ...table, rows: reindexed } }
                              });
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                      <div className="row four">
                        <div className="field">
                          <label>Название</label>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(event) => {
                              const nextRows = rowsSorted.map((item) =>
                                item.id === row.id ? { ...item, name: event.target.value } : item
                              );
                              setContent({
                                ...content,
                                pricing: {
                                  ...content.pricing,
                                  [key]: { ...table, rows: reorderWithKey(nextRows, "order") as PriceRow[] }
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="field">
                          <label>Цена</label>
                          <input
                            type="number"
                            value={row.price}
                            onChange={(event) => {
                              const nextRows = rowsSorted.map((item) =>
                                item.id === row.id ? { ...item, price: Number(event.target.value) } : item
                              );
                              setContent({
                                ...content,
                                pricing: {
                                  ...content.pricing,
                                  [key]: { ...table, rows: reorderWithKey(nextRows, "order") as PriceRow[] }
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="field">
                          <label>Валюта</label>
                          <input
                            type="text"
                            value={row.currency}
                            onChange={(event) => {
                              const nextRows = rowsSorted.map((item) =>
                                item.id === row.id ? { ...item, currency: event.target.value } : item
                              );
                              setContent({
                                ...content,
                                pricing: {
                                  ...content.pricing,
                                  [key]: { ...table, rows: reorderWithKey(nextRows, "order") as PriceRow[] }
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="field">
                          <label>Ед. изм.</label>
                          <input
                            type="text"
                            value={row.unit}
                            onChange={(event) => {
                              const nextRows = rowsSorted.map((item) =>
                                item.id === row.id ? { ...item, unit: event.target.value } : item
                              );
                              setContent({
                                ...content,
                                pricing: {
                                  ...content.pricing,
                                  [key]: { ...table, rows: reorderWithKey(nextRows, "order") as PriceRow[] }
                                }
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="secondary"
                    onClick={() => {
                      const newRow: PriceRow = {
                        id: `${key}-${Date.now()}`,
                        name: "Новая строка",
                        price: 0,
                        currency: "RUB",
                        unit: "",
                        order: rowsSorted.length + 1
                      };
                      setContent({
                        ...content,
                        pricing: { ...content.pricing, [key]: { ...table, rows: [...rowsSorted, newRow] } }
                      });
                    }}
                  >
                    Добавить строку
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {activeSection === "contacts" && (
          <div className="card">
            <div className="field">
              <label>Название компании</label>
              <input
                type="text"
                value={content.contacts.companyName}
                onChange={(event) =>
                  setContent({ ...content, contacts: { ...content.contacts, companyName: event.target.value } })
                }
              />
            </div>
            <div className="row two">
              <div className="field">
                <label>Телефон (tel:)</label>
                <input
                  type="text"
                  value={content.contacts.phone}
                  onChange={(event) => setContent({ ...content, contacts: { ...content.contacts, phone: event.target.value } })}
                />
              </div>
              <div className="field">
                <label>Телефон (текст)</label>
                <input
                  type="text"
                  value={content.contacts.displayPhone}
                  onChange={(event) =>
                    setContent({ ...content, contacts: { ...content.contacts, displayPhone: event.target.value } })
                  }
                />
              </div>
            </div>
            <div className="row two">
              <div className="field">
                <label>Email</label>
                <input
                  type="text"
                  value={content.contacts.email}
                  onChange={(event) => setContent({ ...content, contacts: { ...content.contacts, email: event.target.value } })}
                />
              </div>
              <div className="field">
                <label>Telegram URL</label>
                <input
                  type="text"
                  value={content.contacts.telegramUrl}
                  onChange={(event) =>
                    setContent({ ...content, contacts: { ...content.contacts, telegramUrl: event.target.value } })
                  }
                />
              </div>
            </div>
            <div className="row two">
              <div className="field">
                <label>Telegram handle</label>
                <input
                  type="text"
                  value={content.contacts.telegramHandle}
                  onChange={(event) =>
                    setContent({ ...content, contacts: { ...content.contacts, telegramHandle: event.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>Logo image</label>
                <input
                  type="text"
                  value={content.contacts.logoImage}
                  onChange={(event) =>
                    setContent({ ...content, contacts: { ...content.contacts, logoImage: event.target.value } })
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    handleUpload(file, (url) => {
                      setContent({ ...content, contacts: { ...content.contacts, logoImage: url } });
                    });
                  }}
                />
              </div>
            </div>
            <div className="field">
              <label>Адрес</label>
              <input
                type="text"
                value={content.contacts.address}
                onChange={(event) =>
                  setContent({ ...content, contacts: { ...content.contacts, address: event.target.value } })
                }
              />
            </div>
            <div className="field">
              <label>Ссылка на карту</label>
              <input
                type="text"
                value={content.contacts.mapUrl}
                onChange={(event) =>
                  setContent({ ...content, contacts: { ...content.contacts, mapUrl: event.target.value } })
                }
              />
            </div>
            <div className="row two">
              <div className="field">
                <label>О компании — заголовок</label>
                <input
                  type="text"
                  value={content.contacts.aboutTitle}
                  onChange={(event) =>
                    setContent({ ...content, contacts: { ...content.contacts, aboutTitle: event.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>О компании — текст</label>
                <textarea
                  value={content.contacts.aboutText}
                  onChange={(event) =>
                    setContent({ ...content, contacts: { ...content.contacts, aboutText: event.target.value } })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
